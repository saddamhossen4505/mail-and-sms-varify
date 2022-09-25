
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const { accountVarifyMail } = require('../utility/sendMail');
const sendSMS = require('../utility/sendSMS');




// Show AllverifyStudent Controller.
const showAllverifyStudent = (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const verify = allStudents.filter( data => data.verify == true );
    
    res.render('students/index', {
        allStudents : verify
    });
}




// UnverifyStudent-Table Controller.
const showUnverifyStudentTable = (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const verify = allStudents.filter( data => data.verify == false );

    res.render('students/unverify', {
        allStudents : verify
    });
};



// Create StudentForm Controller.
const showCreateStudentForm = (req, res) => {
    res.render('students/create');
};



// CreateStudentData Controller.
const CreateStudentData = async (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const { id, name, email, cell, location, photo } = req.body;

    // Get id.
    let last_id = 1;
    if( allStudents.length > 0 ){
        last_id = allStudents[allStudents.length - 1 ].id + 1;
    };

    // Create-Token.
    const token = Date.now() +'_'+ Math.floor(Math.random() * 1000000);
    const otp = Math.floor(Math.random() * 1000000);

    

    // Now StudentData add to json db.
    allStudents.push({
        id : last_id,
        name : name,
        email : email,
        cell : cell,
        location : location,
        photo : req.file.filename, 
        verify : false,
        token : token,
        otp : otp
    });

    // Send-Mail
    await accountVarifyMail( req.body.email, "account-vairfy", {
        name, cell, token 
    });

    // Send SMS.
    await sendSMS( req.body.cell, `Hi, ${req.body.name} You are wellcome to our community. You account activation code is ${otp}`)

    // Now RestoreStudentData to json db.
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(allStudents));

    // Now Back to UnverifyStudentData-Table.
    res.redirect('/student/unverify');
};



// SingleDataView Controller.
const showSingleData = (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    // Get id.
    const { id } = req.params;

    // FindData by id.
    const singleData = allStudents.find( data => data.id == id );

    res.render('students/single', {
        student : singleData
    });
};



// EditStudent Data.
const editStudentData = (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    // Get id.
    const { id } = req.params;

    // CheckData.
    const edit_data = allStudents.find( data => data.id == id );

    res.render('students/edit', {
        student : edit_data,
    });

};




// UpdateStudentData Controller.
const updateStudentData = (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const { name, email, cell, location } = req.body;

    // Get id.
    const { id } = req.params;

    // FindIndex from json db.
    const index = allStudents.findIndex( data => data.id == id );

    // EditData.
    allStudents[index] = {
        ...allStudents[index],
        name : name,
        email : email,
        cell : cell,
        location : location
    };

    // Now StoreNewData to db.
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(allStudents));

    // Back to unverifyData-Table.
    res.redirect('/student/unverify');
};




// DeleteStudentData Controller.
const deleteStudentData = (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    // Get id.
    const { id } = req.params;

    // FindAllData without deleteData.
    const newData = allStudents.filter( data => data.id != id );

    // Now StoreNewData to db.
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(newData));

    // Back to unverifyData-Table.
    res.redirect('/student/unverify');
};


// Account-Varify Controller.
const verifyAccount = (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    // Get token.
    const token = req.params.token;

    // FindData from json db token wise.
    allStudents[allStudents.findIndex( data => data.token == token )] = {
        ...allStudents[allStudents.findIndex( data => data.token == token )],
        verify : true,
        token : '',
    };

    // Now restore data to json db.
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(allStudents));

    // Now Back to verify student Table.
    res.redirect('/student')

};



// ShowPhone Varify Controller.
const verifyByPhone = (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    // Get id.
    const { id } = req.params;
    // FindData by id.
    const singleData = allStudents.find( data => data.id == id );

    res.render('students/verifyPhone', {
        student : singleData
    });
};



// Verify by Phone Controller.
const verifyOtpByPhone = (req, res) => {

    // Get allData.
    const allStudents = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));

    // Get Otp.
    const otp = req.params.otp;

    // match otp.
    if( req.body.otp == otp ){

        allStudents[allStudents.findIndex( data => data.otp == otp )] = {
            ...allStudents[allStudents.findIndex( data => data.otp == otp )],
            verify : true,
            otp : '',
        };
    };

    // Now restore data to json db.
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(allStudents));

    // Now Back to verify student Table.
    res.redirect('/student')
}





// Exports Controller.
module.exports = {
    showUnverifyStudentTable,
    showCreateStudentForm,
    CreateStudentData,
    showSingleData,
    editStudentData,
    updateStudentData,
    deleteStudentData,
    showAllverifyStudent,
    verifyAccount,
    verifyByPhone,
    verifyOtpByPhone
};