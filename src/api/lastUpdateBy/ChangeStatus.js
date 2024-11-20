import axios from "axios";

export async function STATUS_LIST(USR, LAI) {
    return new Promise((resolve, reject) => {
        axios.get(`/GroupGet/G36SL/${USR}/${LAI}`)
            .then((res) => { resolve(res.data) })
            .catch((error) => { return reject({ message: error }) })
    })
}