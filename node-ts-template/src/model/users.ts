export  type User = {
    id:number,
    userName: string
}

const users = [{id: 1, userName: "John"}]

export const findIndex = (userId:number):number =>
    users.findIndex(elem => elem.id === userId)

export const addUser = (user: User):boolean => {
    if(users.findIndex(elem => elem.id === user.id)===-1){
        users.push(user)
        return  true
    }
    return false
}

export  const  getAllUsers = ()=> [...users]

export const updateUser = (newUserData: User):boolean => {
    const index = findIndex(newUserData.id)
    if( index === -1) {
        return false}
    else{
        users[index].userName = newUserData.userName
        return true
    }
}

export  const removeUser = (userId:number):User|null => {
    const index = findIndex(userId)
    if( index === -1){
        return null
    }
    else{
        return users.splice(index, 1)[0]
    }
}

export const getUser = (userId: number):User|null => {
    const index = findIndex(userId)
    console.log('index' + index)
    if( index === -1){
        return null
    }else{
        return users[index]
    }
}