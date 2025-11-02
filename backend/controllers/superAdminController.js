

//const clinicModel = require("../.models/clinic");



const overview = (req, res) => {
    res.send("all clinics info is showing");

}
const createClinic = (req, res) => {
    res.send("hello from the create clinic");
}



const addAdmin = (req, res) => {
    res.send("hello from the addadmin controller");
}


const deleteClinic = (req, res) => {
    res.send("hello from the deleting particular clinic");
}

module.exports = {
    overview,
    deleteClinic,
    createClinic,
    addAdmin
}