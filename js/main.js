/* JS for WATS 3020 Roster Project */

// A Person has a name, email, and username that is derived from the email address
class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        // require the @ symbol in email addresses
        while (this.email.indexOf('@') == -1) {
            this.email = prompt("Please enter a correctly formatted email addres with the @ symbol", this.email);

        }
        this.username = this.email.slice(0, this.email.indexOf('@'));
        console.log("email: " + this.email + " username: " + this.username);

    }

}

// A Student is a type of Person that also has an attendance record 
class Student extends Person {
    constructor(name, email) {
        super(name, email);
        this.presentDays = 0;
        this.absentDays = 0;
        this.attendance = [];
    }

    // Adds a 1 for to a Student's attendance array when they are marked present
    // and tracks the number of present days
    markPresent() {
        this.presentDays += 1;
        this.attendance.push(1);

    }

    // Adds a 0 to a Student's attendance array when they are marked absent
    // and tracks the number of absent days
    markAbsent() {
        this.absentDays += 1;
        this.attendance.push(0);
    }

    // Calculate the Student's attendance rate based on the attendance recorded in the
    // student's attendance array
    calculateAttendance() {
        if (this.attendance.length < 1) {
            return 0;
        } else {
            let totalDays = this.attendance.length;
            let presentDays = 0;
            for (let i = 0; i < this.attendance.length; i++) {
                presentDays += this.attendance[i];
            }

            let attendanceRate = 0;
            if (presentDays > 0) {
                attendanceRate = presentDays / totalDays * 100;
            }
            console.log("attendanceRate is " + attendanceRate);
            return attendanceRate + '%';
        }

    }
}

// A Teacher is a Person with an honorific
class Teacher extends Person {
    constructor(name, email, honorific) {
        super(name, email);
        this.honorific = honorific;
    }
}

// A Course has a code, title, description, teacher, and array of students
class Course {
    constructor(courseCode, courseTitle, courseDescription) {
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }


    // Add students to the roster based on user input for name and email
    addStudent() {
        let newStudentName = prompt("Please enter student's name: ", "John Student");
        let newStudentEmail = prompt("Please enter student's email:", "john.student@example.com");
        let newStudent = new Student(newStudentName, newStudentEmail);
        console.log("Adding student " + newStudent.name + " with username:" + newStudent.username + " and email:" + newStudent.email);
        //check whether a student with this username has already been added to the roster
        if (this.findStudent(newStudent.username)) {
            alert("This student has already been added to the class. All students must have unique email/usernames");
        } else if (newStudent.email) {
            this.students.push(newStudent);
            updateRoster(this);
        }
    }

    // Remove Student based on username
    removeStudent(username) {
        //find the position of the student in the student array
        let removeIndex = this.students.map(function (item) {
            return item.username;
        }).indexOf(username);

        // remove student from the array
        this.students.splice(removeIndex, 1);

    }


    // Add a teacher for the course based on user inputs for name and email
    setTeacher() {
        let teacherName = prompt("Please enter teacher's name: ", "Jane Teacher");
        let teacherEmail = prompt("Please enter teacher's email:", "jane.teacher@example.com");
        // In the absence of instructions to gather user input for the honorific, I set all teacher honorific's to Grand Teacher
        this.teacher = new Teacher(teacherName, teacherEmail, "Grand Teacher");

        updateRoster(this);
    }

    //Remove the course teacher
    removeTeacher() {
        this.teacher = null;
        updateRoster(this);
    }

    // Mark the student as present or absent
    markAttendance(username, attendance) {
        let currentStudent = this.findStudent(username);
        if (attendance == 'present') {
            currentStudent.markPresent();
        } else if (attendance == 'absent') {
            currentStudent.markAbsent();
        }

    }

    //////////////////////////////////////////////
    // commenting out "basic implementation"
    //markAttendance(username, attendance) {
    //let currentStudent = this.findStudent(username);
    //    if (attendance == 'present') {
    //       currentStudent.attendance.push(1);
    //    } else if (attendance == 'absent') {
    //       currentStudent.attendance.push(0);
    //   }
    //////////////////////////////////////////////


    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(username) {
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objects contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function (student, index) {
            return student.username == username;
        });
        return foundStudent;
    }
}

// Set a course's code, title, and description based on user inputs
let courseCode = prompt("Please enter course code:", "WATS3020");
let courseTitle = prompt("Please enter course title:", "Intro - Javascript Programming");
let courseDescription = prompt("Please enter a course description: ", "Learn how to write JavaScript and how to use it on web sites to make engaging, interactive pages");
let myCourse = new Course(courseCode, courseTitle, courseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher) {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function (e) {
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})


// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function (e) {
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})
let removeTeacherButton = document.querySelector('#remove-teacher');
removeTeacherButton.addEventListener('click', function (e) {
    console.log('Calling removeTeacher() method.');
    myCourse.removeTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course) {
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher) {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students) {
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);


        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        //add Present Days
        let presentTD = document.createElement('td');
        presentTD.innerHTML = student.presentDays;
        newTR.appendChild(presentTD);

        //add Absent Days
        let absentTD = document.createElement('td');
        absentTD.innerHTML = student.absentDays;
        newTR.appendChild(absentTD);


        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        //add Remove Student button
        let removeButton = document.createElement('button');
        removeButton.innerHTML = "Remove Student";
        removeButton.setAttribute('data-username', student.username);
        removeButton.setAttribute('class', 'remove');
        actionsTD.appendChild(removeButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
    setupRemovalButtons();
}

function setupAttendanceButtons() {
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons) {
        button.addEventListener('click', function (e) {
            console.log(`Marking ${e.target.dataset.username} present.`);
            // I changed this to mark the student as present
            myCourse.markAttendance(e.target.dataset.username, 'present');
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons) {
        button.addEventListener('click', function (e) {
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }


}

function setupRemovalButtons() {
    // Set up the event listeners for buttons to mark attendance.
    let removeButtons = document.querySelectorAll('.remove');
    for (button of removeButtons) {
        button.addEventListener('click', function (e) {
            console.log(`Removing ${e.target.dataset.username} .`);
            // I changed this to mark the student as present
            myCourse.removeStudent(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
}