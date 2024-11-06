import axios from "axios";
export async function GET_DATA(path, data) {
    return new Promise((resolve, reject) => {
        axios.get(path, data)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
            })
    })
}

export async function GET_LIST(path) {
    return new Promise((resolve, reject) => {
        axios.get(path)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                return reject({ message: error });
            })
    })
}

export async function POST_DATA(path, data) {
    return new Promise((resolve, reject) => {
        axios.post(path, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                return reject({ message: error });
            })
    })
}

export async function GetBranchCode(data) {
    return new Promise((resolve, reject) => {
        axios.get('/getBranchList')
            .then((res) => {
                res.data.list?.map((x) => {
                    if (x.code === data || x.name === data) { resolve(x.code) }
                })
            })
            .catch(error => {
                return reject({ message: error });
            })
    })
}

export async function GetPurposeId(data) {
    return new Promise((resolve, reject) => {
        axios.get('/getLoanPurpose')
            .then((res) => {
                res.data.list?.map((x) => {
                    if (x.id === data || x.purpose === data) { resolve(x.id) }
                })
            })
            .catch(error => {
                return reject({ message: error });
            })
    })
}

export async function GetLoanProduct(data) {
    return new Promise((resolve, reject) => {
        axios.get('/getListLoanProduct')
            .then((res) => {
                res.data.list?.map((x) => {
                    if (x.code === data || x.description === data) { resolve(x.description) }
                })
            })
            .catch(error => {
                return reject({ message: error });
            })
    })
}

export async function GetLoanPurpose(data) {
    return new Promise((resolve, reject) => {
        axios.get('/getLoanPurpose')
            .then((res) => {
                res.data.list?.map((x) => {
                    if (x.id === data || x.purpose === data) { resolve(x.purpose) }
                })
            })
            .catch(error => {
                return reject({ message: error });
            })
    })
}


export async function GetDocType() {
    return new Promise((resolve, reject) => {
        axios.get('/getDocType')
            .then((res) => {
                resolve(res.data.list);
            })
            .catch((error) => {
                return reject({ message: error });
            });
    });
}
