const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
const bcrypt = require('bcrypt')

const User = require('../models/Users');
const Blogs = require('../models/Blog');

AdminBro.registerAdapter(AdminBroMongoose);

// RBAC functions
const canEditBlogs = ({ currentAdmin, record }) => {
    return currentAdmin && (
      currentAdmin.role === 'admin'
      || currentAdmin._id === record.param('ownerId')
    )
  }
  const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'

const adminBro = new AdminBro({
    rootPath: '/admin',
    resources: [{
        resource: Blogs,
        options: {
          properties: {
            ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
          },
          actions: {
            edit: { isAccessible: canEditBlogs },
            delete: { isAccessible: canEditBlogs },
            new: {
              before: async (request, { currentAdmin }) => {
                request.payload = {
                  ...request.payload,
                  ownerId: currentAdmin._id,
                }
                return request
              },
            }
          }
        }
      },
        {
        resource: User,
        options: {
            properties: {
                isVisible: false,
            },
            password: {
                type: 'string',
                isVisible : {
                    list: false, edit: true, filter: false, show: false,
                },
            },
        },
    //     actions: {
    //         new: {
    //             before: async (request) => {
    //               if(request.payload.record.password) {
    //                 request.payload.record = {
    //                   ...request.payload.record,
    //                   encryptedPassword: await bcrypt.hash(request.payload.record.password, 10),
    //                   password: undefined,
    //                 }
    //               }
    //               return request
    //             },
    //     }
    // }
}
],
})

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {

    authenticate: async (email, password) => {
        const user = await User.findOne({ email })
        if (email === email && password === password) {
            return user
        }
        return false
    },
    cookieName: 'admin-bro',
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
})


module.exports = router