export  type User = {
    id:number,
    userName: string
}

const users = [{id: 1, userName: "John"}]

export const addUser = (user: User):boolean => {
    if(users.findIndex(elem => elem.id === user.id)===-1){
        users.push(user)
        return  true
    }
    return false
}

export  const  getAllUsers = ()=> [...users]

export const updateUser = (newUserData: User):boolean => {
    const index = users.findIndex(elem => elem.id === newUserData.id)
    if( index === -1) {
        return false}
    else{
        users[index].userName = newUserData.userName
        return true
    }
}

