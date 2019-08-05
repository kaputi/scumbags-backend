import usersModel from '../models/users.model'

const checkPermissions = async (id) => {
  let isAdmin = false
  await usersModel.findOne({ _id: id }, (err, userInfo) => {
    if (userInfo.role === 'admin') {
      isAdmin = true
    }
  })
  return isAdmin
}

export default checkPermissions
