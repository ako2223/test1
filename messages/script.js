// Assuming the server URL is correct
const URL = "http://localhost:8000";
const tbody = document.querySelector(".studentsTable tbody");
const addStudentBtn = document.querySelector(".add_student");

// Function to fetch and render students from the server
const getStudents = () => {
  fetch(`${URL}/students`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      return response.json();
    })
    .then((students) => {
      renderStudents(students);
    })
    .catch((error) => {
      console.error("Error fetching students:", error);
    });
};

// Function to delete a student
const deleteStudent = (studentID) => {
  fetch(`${URL}/students/${studentID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      getStudents(); // Refresh the student list after deletion
    })
    .catch((error) => {
      console.error("Error deleting student:", error);
    });
};

// Function to edit a student
const editStudent = (studentID, data) => {
  fetch(`${URL}/students/${studentID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to edit student");
      }
      getStudents(); // Refresh the student list after editing
    })
    .catch((error) => {
      console.error("Error editing student:", error);
    });
};

// Function to render students in the table
const renderStudents = (students) => {
  tbody.innerHTML = ""; // Clear existing rows
  students.forEach((student, index) => {
    let tr = `
      <tr>
        <td>${index + 1}</td>
        <td><input type="text" value="${student.name}" disabled></td>
        <td><input type="text" value="${student.gender}" disabled></td>
        <td><input type="text" value="${student.age}" disabled></td>
        <td>
          <button onclick="deleteStudent(${student.id})">Delete</button>
          <button onclick="toggleEdit(${student.id})">Edit</button>
          <button onclick="sendMessageToStudent(${
            student.id
          })">Send message</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += tr;
  });
};

// Function to send a message to a student

// Function to toggle edit mode for a student
const toggleEdit = (studentID) => {
  const nameInput = document.querySelector(`input[name=name-${studentID}]`);
  const genderInput = document.querySelector(`input[name=gender-${studentID}]`);
  const ageInput = document.querySelector(`input[name=age-${studentID}]`);

  if (nameInput.disabled) {
    // Enable inputs for editing
    nameInput.removeAttribute("disabled");
    genderInput.removeAttribute("disabled");
    ageInput.removeAttribute("disabled");
  } else {
    // Disable inputs and save changes
    nameInput.setAttribute("disabled", true);
    genderInput.setAttribute("disabled", true);
    ageInput.setAttribute("disabled", true);

    const updatedData = {
      name: nameInput.value,
      gender: genderInput.value,
      age: ageInput.value,
    };
    editStudent(studentID, updatedData);
  }
};

// Function to add a new student
const addStudent = (data) => {
  fetch(`${URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add student");
      }
      getStudents(); // Refresh the student list after addition
    })
    .catch((error) => {
      console.error("Error adding student:", error);
    });
};

// Event listener for adding a new student
addStudentBtn.addEventListener("click", () => {
  const nameValue = document.querySelector("#name").value;
  const genderValue = document.querySelector("#gender").value;
  const ageValue = document.querySelector("#age").value;

  const newStudent = {
    name: nameValue,
    gender: genderValue,
    age: ageValue,
  };
  addStudent(newStudent);
});

// Function to fetch existing messages for a student
// Function to send a new message to a student
// Function to fetch existing messages for a student
const getStudentMessages = (studentID) => {
  return fetch(`${URL}/students/${studentID}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get student data");
      }
      return response.json();
    })
    .then((student) => {
      // Extract messages from student object
      return student.messages || [];
    })
    .catch((error) => {
      console.error("Error getting messages for student:", error);
      throw error; // Re-throw the error to be caught later
    });
};

// Function to send a new message to a student
const sendMessageToStudent = (studentID) => {
  // Prompt user for sender's name and message content
  const senderName = prompt("Enter your name:");
  const messageContent = prompt("Enter your message:");

  if (!senderName || !messageContent) {
    console.error("Sender's name or message content is empty");
    return;
  }

  // First, get existing messages
  getStudentMessages(studentID)
    .then((existingMessages) => {
      // Construct the new message with sender's name and content
      const newMessage = `${senderName}:${messageContent}`;
      const updatedMessages = [...existingMessages, newMessage]; // Add new message to existing messages
      // Then, send a PATCH request to update the messages
      return fetch(`${URL}/students/${studentID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      console.log("Message sent successfully");
      getStudents(); // Refresh the student list after sending the message
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
};

getStudents();
