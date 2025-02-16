import methods from '@services/index' 

const BASE_PATH = "/pets"

const getAll = (params) => {
    return methods.get({path:BASE_PATH, params})
}


const getById = (id) => {
    console.log("id petService", id)
    return methods.get({path:BASE_PATH, id})
}

export default {getAll, getById}