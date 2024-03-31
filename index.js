// const initialPassword = document.getElementById("initial-password")
// const initialPasswordConfirmBtn = document.getElementById("enter-first-password")
// const mainWrapper = document.getElementById("main-wrapper")
// const logInSection = document.getElementById("log-in-first")
// let loggedIn = false

// initialPasswordConfirmBtn.addEventListener("dblclick", function() {
//     if (initialPassword.value === initialPasswordSet) {
//         loggedIn = true
//         initialPassword.value = ""
//         logInSection.className = "disappear"
//         mainWrapper.className = ""
//     }
//     initialPassword.value = ""
// })

// initialPassword.focus()

// initialPassword.addEventListener("keydown", function(e) {
//     if (e.key === 'Enter') {
//         if (initialPassword.value === initialPasswordSet) {
//             loggedIn = true
//             initialPassword.value = ""
//             logInSection.className = "disappear"
//             mainWrapper.className = ""
//         }
//         initialPassword.value = ""
//     }
// })

// document.addEventListener('contextmenu', (e) => e.preventDefault());

// function ctrlShiftKey(e, keyCode) {
//   return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
// }

// document.onkeydown = (e) => {
//   // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
//   if (
//     event.keyCode === 123 ||
//     ctrlShiftKey(e, 'I') ||
//     ctrlShiftKey(e, 'J') ||
//     ctrlShiftKey(e, 'C') ||
//     (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
//   )
//     return false;
// };





import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://public-workspace-default-rtdb.europe-west1.firebasedatabase.app/"
}


const app = initializeApp(appSettings)
const database = getDatabase(app)
const platformListInDB = ref(database, "platformList")
const usernameListInDB = ref(database, "usernameList")
const passwordListInDB = ref(database, "passwordList")


const platformInput = document.getElementById("platform-input")
const usernameInput = document.getElementById("username-input")
const passwordInput = document.getElementById("password-input")
const saveBtn = document.getElementById("save-btn")
const warningMsg = document.getElementById("warning-msg")

let platformDisplayList = document.getElementById("saved-platform-list")
let usernameDisplayList = document.getElementById("saved-username-list")
let passwordDisplayList = document.getElementById("saved-password-list")



saveBtn.addEventListener("click", function() {
    let tempPlatformInput = platformInput.value
    let tempUsernameInput = usernameInput.value
    let tempPasswordInput = passwordInput.value
    warningMsg.className = "disappear"

    if (tempPlatformInput === "" || tempUsernameInput === "" || tempPasswordInput === "") {
        warningMsg.className = ""
        setTimeout(function() {
            warningMsg.className = "disappear"
        }, 500)
    } else {
        push(platformListInDB, tempPlatformInput)
        push(usernameListInDB, tempUsernameInput)
        push(passwordListInDB, tempPasswordInput)
        
        clearInputFields()

        warningMsg.className = "disappear"
    }
})


passwordInput.addEventListener("keydown", function(e) {
    if (e.key === 'Enter') {
        let tempPlatformInput = platformInput.value
        let tempUsernameInput = usernameInput.value
        let tempPasswordInput = passwordInput.value

        if (tempPlatformInput === "" || tempUsernameInput === "" || tempPasswordInput === "") {
            warningMsg.className = ""
        } else {
            push(platformListInDB, tempPlatformInput)
            push(usernameListInDB, tempUsernameInput)
            push(passwordListInDB, tempPasswordInput)
            
            clearInputFields()

            warningMsg.className = "disappear"
        }
    }
})


function clearInputFields() {
    platformInput.value = ""
    usernameInput.value = ""
    passwordInput.value = ""
}


onValue(platformListInDB, function(snapshotPlatformList) {
    onValue(usernameListInDB, function(snapshotUsernameList) {
        onValue(passwordListInDB, function(snapshotPasswordList) {
            if (snapshotPlatformList.exists()) {
                let platformArray = Object.entries(snapshotPlatformList.val())
                let usernameArray = Object.entries(snapshotUsernameList.val())
                let passwordArray = Object.entries(snapshotPasswordList.val())


                // Create an array of objects containing the original values and their indices
                let combinedArray = platformArray.map((value, index) => ({ value, index }));

                // Sort the combined array based on the values
                combinedArray.sort((a, b) => {
                    let stringA = a.value[1].toLowerCase();
                    let stringB = b.value[1].toLowerCase();
                    
                    if (stringA > stringB) {
                        return -1;
                    } else if (stringA < stringB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                // Rearrange both arrays based on the sorted indices
                platformArray = combinedArray.map(item => item.value);
                usernameArray = combinedArray.map(item => usernameArray[item.index]);
                passwordArray = combinedArray.map(item => passwordArray[item.index]);



                clearGroupListEl()

                for (let i = 0; i < platformArray.length; i++) {
                    let x = platformArray.length - 1 - i
                    let platformItem = platformArray[x]
                    let usernameItem = usernameArray[x]
                    let passwordItem = passwordArray[x]

                    render(platformItem, usernameItem, passwordItem)
                }
            } else {
                
            }
        })
    })
})



function clearGroupListEl() {
    platformDisplayList.innerHTML = ""
    usernameDisplayList.innerHTML = ""
    passwordDisplayList.innerHTML = ""
}


function render(platformStored, usernameStored, passwordStored) {
    let platformID = platformStored[0]
    let platformValue = platformStored[1]

    let usernameID = usernameStored[0]
    let usernameValue = usernameStored[1]

    let passwordID = passwordStored[0]
    let passwordValue = passwordStored[1]



    let platformEl = document.createElement("li")
    platformEl.innerHTML = `<p class='table-element'>${platformValue}</p>`
    platformDisplayList.append(platformEl)
    platformEl.className = "login-styled"

    let usernameEl = document.createElement("li")
    usernameEl.innerHTML = `<p class='table-element'>${usernameValue}</p>`
    usernameDisplayList.append(usernameEl)
    usernameEl.className = "login-styled"


    let passwordEl = document.createElement("li")
    passwordEl.innerHTML = `<p id='password' class='table-element'>${passwordValue}</p>`
    passwordDisplayList.append(passwordEl)
    passwordEl.className = "login-styled"



    platformEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(platformValue)
            platformEl.innerHTML = `<p class='table-element' style="white-space: pre-line">Copied ✔️</p>`
            setTimeout(function() {
                platformEl.innerHTML = `<p class='table-element' style="white-space: pre-line">${platformValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            push(archivedPlatformListInDB, platformValue)
            push(archivedUsernameListInDB, usernameValue)
            push(archivedPasswordListInDB, passwordValue)
            let exactLocationOfPlatformInDB = ref(database, `platformList/${platformID}`)
            let exactLocationOfUsernameInDB = ref(database, `usernameList/${usernameID}`)
            let exactLocationOfPasswordInDB = ref(database, `passwordList/${passwordID}`)

            remove(exactLocationOfPlatformInDB)
            remove(exactLocationOfUsernameInDB)
            remove(exactLocationOfPasswordInDB)
        } 
    }


    usernameEl.addEventListener("click", function() {
        navigator.clipboard.writeText(usernameValue)
        usernameEl.innerHTML = `<p class='table-element'>Copied ✔️</p>`
        setTimeout(function() {
            usernameEl.innerHTML = `<p class='table-element'>${usernameValue}</p>`
        }, 500)
    })

    passwordEl.addEventListener("click", function() {
        navigator.clipboard.writeText(passwordValue)
        passwordEl.innerHTML = `<p class='table-element'>Copied ✔️</p>`
        setTimeout(function() {
            passwordEl.innerHTML = `<p id='password' class='table-element'>${passwordValue}</p>`
        }, 500)
    })
    

}




let loginTitle = document.querySelector("#saved-passwords-title")
let loginSection = document.querySelector("#login-wrapper")
let addLoginSection = document.querySelector("#add-login-section")
let addLoginToggle = 0

loginTitle.addEventListener("click", function() {
    if (addLoginToggle % 2 === 0) {
        loginSection.className = "version2-wrapper"
        addLoginSection.className = ""
        platformInput.focus()
        addLoginToggle += 1
    } else {
        loginSection.className = "disappear"
        addLoginSection.className = "disappear" 
        addLoginToggle += 1
    }
})






















// INPUT SECTION UPDATES TO WIDTH OF OPTIONS FUNCTIONS: 

document.addEventListener('DOMContentLoaded', (event) => {
    synchronizeNotesWidths();
    synchronizeShiftsWidths();
    synchronizeGeneralNotesWidths();
    synchronizeTemplateWidths();
});

function synchronizeNotesWidths() {
    const inputField = document.getElementById('note-section-input');
    const selectElement = document.getElementById('notes-sections');
    const temp = 0;

    // Function to set input field width to match select element width
    function setInputWidth() {
        inputField.style.width = selectElement.offsetWidth + 'px';
    }

    // Set the initial width of the input field after the select element has loaded
    setInputWidth();

    if (noteSectionDropdown.selectedIndex != 0) {
        temp = noteSectionDropdown.selectedIndex
    }

    noteSectionDropdown.selectedIndex = 0 
    noteSectionDropdown.selectedIndex = temp

    // Update the input field width whenever the select element changes
    selectElement.addEventListener('change', setInputWidth);
}


function synchronizeShiftsWidths() {
    const inputField = document.getElementById('shift-section-input');
    const selectElement = document.getElementById('shift-sections');
    const temp = 0;

    // Function to set input field width to match select element width
    function setInputWidth() {
        inputField.style.width = selectElement.offsetWidth + 'px';
    }

    // Set the initial width of the input field after the select element has loaded
    setInputWidth();

    if (shiftSectionDropdown.selectedIndex != 0) {
        temp = shiftSectionDropdown.selectedIndex
    }

    shiftSectionDropdown.selectedIndex = 0 
    shiftSectionDropdown.selectedIndex = temp

    // Update the input field width whenever the select element changes
    selectElement.addEventListener('change', setInputWidth);
}

function synchronizeGeneralNotesWidths() {
    const inputField = document.getElementById('general-note-section-input');
    const selectElement = document.getElementById('general-notes-sections');
    const temp = 0;

    // Function to set input field width to match select element width
    function setInputWidth() {
        inputField.style.width = selectElement.offsetWidth + 'px';
    }

    // Set the initial width of the input field after the select element has loaded
    setInputWidth();

    if (generalNoteSectionDropdown.selectedIndex != 0) {
        temp = generalNoteSectionDropdown.selectedIndex
    }

    generalNoteSectionDropdown.selectedIndex = 0 
    generalNoteSectionDropdown.selectedIndex = temp

    // Update the input field width whenever the select element changes
    selectElement.addEventListener('change', setInputWidth);
}


function synchronizeTemplateWidths() {
    const inputField = document.getElementById('template-section-input');
    const selectElement = document.getElementById('template-sections');
    const temp = 0;

    // Function to set input field width to match select element width
    function setInputWidth() {
        inputField.style.width = selectElement.offsetWidth + 'px';
    }

    // Set the initial width of the input field after the select element has loaded
    setInputWidth();

    if (templateSectionDropdown.selectedIndex != 0) {
        temp = templateSectionDropdown.selectedIndex
    }

    templateSectionDropdown.selectedIndex = 0 
    templateSectionDropdown.selectedIndex = temp

    // Update the input field width whenever the select element changes
    selectElement.addEventListener('change', setInputWidth);
}



















// NOTES SECTION:

let notesTitle = document.querySelector("#saved-notes-title")
let notesSection = document.querySelector("#notes-wrapper")
let addNotesToggle = 0

notesTitle.addEventListener("click", function() {
    if (addNotesToggle % 2 === 0) {
        notesSection.className = "version2-wrapper"
        addNotesToggle += 1
        noteInput.focus()
    } else {
        notesSection.className = "disappear"
        addNotesToggle += 1
    }
})



let noteSectionCheckbox = document.querySelector("#add-note-section-checkbox")
let noteSectionOptions = document.querySelector("#note-section-options")
let noteSectionOptionsToggle = 0

noteSectionCheckbox.addEventListener("click", function() {
    if (noteSectionOptionsToggle % 2 === 0) {
        noteSectionOptions.className = ""
        noteSectionOptionsToggle += 1

        synchronizeNotesWidths()

    } else {
        noteSectionOptions.className = "disappear"
        noteSectionOptionsToggle += 1
    }
})


const saveNote = document.getElementById("note-save-button")
const noteInput = document.getElementById("note-input")
let noteList = document.getElementById("notes-list")
let sectionList = document.getElementById("section-list-wrapper")

const notesListInDB = ref(database, "noteList")
const noteSectionsListInDB = ref(database, "noteSectionsList")

const newNoteSection = document.getElementById("note-section-input")
let noteSectionDropdown = document.getElementById("notes-sections")
let notesWarningMsg = document.getElementById("notes-warning-msg")

clearDropdown(noteSectionDropdown)

saveNote.addEventListener("click", function() {
    let theNoteInput = noteInput.value 
    let theNewNoteSection = newNoteSection.value
    let theNoteSectionFromDropdown = noteSectionDropdown.options[noteSectionDropdown.selectedIndex].text
    notesWarningMsg.className = "disappear"

    if (theNewNoteSection === "" && theNoteSectionFromDropdown === "**Not Selected**") {

        push(notesListInDB, theNoteInput)
        push(noteSectionsListInDB, "**Not Selected**")
        noteInput.value = ""
        newNoteSection.value = ""
        noteSectionDropdown.selectedIndex = 0

        noteInput.focus()

    } else if (theNewNoteSection != "" && theNoteSectionFromDropdown === "**Not Selected**") {

        push(notesListInDB, theNoteInput)
        push(noteSectionsListInDB, theNewNoteSection)
        noteInput.value = ""
        newNoteSection.value = ""

        let length = noteSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (noteSectionDropdown.options[i].textContent === theNewNoteSection) {
                noteSectionDropdown.selectedIndex = i
            }
        }

        noteInput.focus()

    } else if (theNewNoteSection === "" && theNoteSectionFromDropdown != "**Not Selected**") {
        
        push(notesListInDB, theNoteInput)
        push(noteSectionsListInDB, theNoteSectionFromDropdown)
        noteInput.value = ""
        newNoteSection.value = ""

        let length = noteSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (noteSectionDropdown.options[i].textContent === theNoteSectionFromDropdown) {
                noteSectionDropdown.selectedIndex = i
            }
        }

        noteInput.focus()
        
    } else {
        notesWarningMsg.className = "warning-msg"
        setTimeout(function() {
            notesWarningMsg.className = "disappear"
        }, 500)
        noteSectionDropdown.focus()
    }
})


noteInput.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveNote.click()
    }
})

newNoteSection.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveNote.click()
    }
})

noteSectionDropdown.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveNote.click()
    }
})


onValue(notesListInDB, function(snapshotNote) {
    onValue(noteSectionsListInDB, function(snapshotNoteSection) {
        if (snapshotNote.exists()) {
            let notesArray = Object.entries(snapshotNote.val())
            let noteSectionsArray = Object.entries(snapshotNoteSection.val())




            // Create an array of objects containing the original values and their indices
            let combinedArray = noteSectionsArray.map((value, index) => ({ value, index }));

            // Sort the combined array based on the values
            combinedArray.sort((a, b) => {
                let stringA = a.value[1].toLowerCase();
                let stringB = b.value[1].toLowerCase();
                
                if (stringA < stringB) {
                    return -1;
                } else if (stringA > stringB) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // Rearrange both arrays based on the sorted indices
            noteSectionsArray = combinedArray.map(item => item.value);
            notesArray = combinedArray.map(item => notesArray[item.index]);




            noteList.innerHTML = ""
            sectionList.innerHTML = ""
            renderedSections = []
            renderedSectionsIDs = []

            clearDropdown(noteSectionDropdown)

            theStoredNoteIDs = []
            theStoredNoteValues = []
            theStoredNoteSectionIDs = []
            theStoredNoteSectionValues = []

            for (let i = 0; i < notesArray.length; i++) {
                // let x = notesArray.length - 1 - i
                let noteItem = notesArray[i]
                let sectionItem = noteSectionsArray[i]

                renderNotes(noteItem, sectionItem)
            }

        } else {
            sectionList.innerHTML = ""
            noteList.innerHTML = "No daily task notes here... yet"
        }
    })
})


function clearDropdown(dropdown) {
    let length = dropdown.options.length - 1;
    for (let i = length; i >= 0; i--) {
        dropdown.remove(i)
    }
    let addToDropdown = document.createElement("option")
    addToDropdown.value = 0
    addToDropdown.text = "**Not Selected**"
    dropdown.append(addToDropdown)
    dropdown.selectedIndex = 0 
}

let btnList = document.getElementById("button-list")


let renderedSections = []
let renderedSectionsIDs = []
let thisSectionToggleCounter = []

let numItems = 0
let noteDeleteHelper = 0 

let theStoredNoteIDs = []
let theStoredNoteValues = []
let theStoredNoteSectionIDs = []
let theStoredNoteSectionValues = []

function renderNotes(noteStored, sectionStored) {
    let noteID = noteStored[0]
    let noteValue = noteStored[1]

    let sectionID = sectionStored[0]
    let sectionValue = sectionStored[1]

    theStoredNoteIDs.push(noteID)
    theStoredNoteValues.push(noteValue)
    theStoredNoteSectionIDs.push(sectionID)
    theStoredNoteSectionValues.push(sectionValue)


    let newEl = document.createElement("li")
    newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`

    let deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `<button id='${noteID}' class='disappear'></button>`
    btnList.append(deleteBtn)

    if (sectionValue === "**Not Selected**") {
        noteList.append(newEl)
    } else if (renderedSections.includes(sectionValue)) {
        for (let i = 0; i < renderedSections.length; i++) {
            if (renderedSections[i] === sectionValue) {
                let thisSection = document.getElementById(`${renderedSectionsIDs[i]}`)
                thisSection.append(newEl)
            }
        }

    } else {
        let theSectionList = document.createElement("ul")
        theSectionList.id = `${sectionID}`
        theSectionList.className = "disappear"

        let sectionHeader = document.createElement("li")
        sectionHeader.innerHTML = `<h3 id='${sectionID}-title' class="heading">${sectionValue}</h3>`
        sectionList.append(sectionHeader)

        theSectionList.append(newEl)
        sectionList.append(theSectionList)

        renderedSections.push(sectionValue)
        renderedSectionsIDs.push(sectionID)
        thisSectionToggleCounter.push(0)
        let index = renderedSections.length - 1

        let addToDropdown = document.createElement("option")
        addToDropdown.id = `${sectionID}-dropdown`
        addToDropdown.value = sectionID
        addToDropdown.text = sectionValue
        noteSectionDropdown.append(addToDropdown)

        if (thisSectionToggleCounter[index] % 2 != 0) {
            theSectionList.className = "sectionList"
        }

        sectionHeader.onclick = event => {
            if (event.detail === 1) {
                for (let i = 0; i < renderedSections.length; i++) {
                    if (renderedSections[i] === sectionValue) {
                        if (thisSectionToggleCounter[i] % 2 === 0) {
                            theSectionList.className = "sectionList"
                            thisSectionToggleCounter[i] += 1
                        } else {
                            theSectionList.className = "disappear"
                            thisSectionToggleCounter[i] += 1
                        }
                    }
                }
            } else if (event.detail === 2) {

                thisSectionToggleCounter[index] = 0

                if (noteDeleteHelper === 0) {
                    for (let i = 0; i < theStoredNoteIDs.length; i++) {
                        if (theStoredNoteSectionValues[i] === sectionValue) {
                            numItems += 1
                        }
                    }
                    noteDeleteHelper = 1
                }

                while (numItems > 0) {
                    for (let i = theStoredNoteIDs.length - 1; i >= 0; i--) {
                        if (theStoredNoteSectionValues[i] === sectionValue) {
                            let movingNoteID = theStoredNoteIDs[i]
                            let currentBtn = document.getElementById(`${movingNoteID}`)
                            currentBtn.click()
                            numItems -= 1
                        }
                    }
                }

                numItems = 0 
                noteDeleteHelper = 0 
            } 
        }
    }

    newEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(noteValue)
            newEl.innerHTML = `<p style="white-space: pre-line">(Copied ✔️) ${noteValue}</p>`
            setTimeout(function() {
                newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            deleteBtn.click()
        }
    }

    deleteBtn.addEventListener("click", function() {
        push(archivedNotesListInDB, noteValue)
        push(archivedNoteSectionsListInDB, sectionValue)

        let theNoteSectionFromDropdown = noteSectionDropdown.options[noteSectionDropdown.selectedIndex].text
        clearDropdown(noteSectionDropdown)
        


        let exactLocationOfNoteInDB = ref(database, `noteList/${noteID}`)
        remove(exactLocationOfNoteInDB)

        let thisLength = thisSectionToggleCounter.length - 1
        thisSectionToggleCounter.splice(thisLength, 1)


        let exactLocationOfSectionInDB = ref(database, `noteSectionsList/${sectionID}`)
        remove(exactLocationOfSectionInDB)

        let thisSecondLength = thisSectionToggleCounter.length - 1
        thisSectionToggleCounter.splice(thisSecondLength, 1)



        let length = noteSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (noteSectionDropdown.options[i].textContent === theNoteSectionFromDropdown) {
                noteSectionDropdown.selectedIndex = i
            }
        }

        for (let x = theStoredNoteIDs.length - 1; x >= 0; x--) {
            if (theStoredNoteIDs[x] === noteID) {
                theStoredNoteIDs.splice(x, 1)
                theStoredNoteValues.splice(x, 1)
                theStoredNoteSectionIDs.splice(x, 1)
                theStoredNoteSectionValues.splice(x, 1)
            }
        }


        for (let k = renderedSections.length - 1; k >= 0; k--) {
            if (renderedSections[k] === sectionValue) {
                let sectionTotalOccurences = 0
                for (let j = theStoredNoteSectionValues.length - 1; j >= 0; j--) {
                    if (theStoredNoteSectionValues[j] === sectionValue) {
                        sectionTotalOccurences += 1
                    }
                }

                if (sectionTotalOccurences === 0) {
                    thisSectionToggleCounter.splice(k, 1)
                }
            }
        }
    })

    synchronizeNotesWidths()
}




























// SHIFTS SECTION:

let shiftTitle = document.querySelector("#saved-shift-title")
let shiftSection = document.querySelector("#shift-wrapper")
let shiftToggle = 0

shiftTitle.addEventListener("click", function() {
    if (shiftToggle % 2 === 0) {
        shiftSection.className = "version2-wrapper"
        shiftToggle += 1
        shiftInput.focus()
    } else {
        shiftSection.className = "disappear"
        shiftToggle += 1
    }
})



let shiftSectionCheckbox = document.querySelector("#add-shift-section-checkbox")
let shiftSectionOptions = document.querySelector("#shift-section-options")
let shiftSectionOptionsToggle = 0

shiftSectionCheckbox.addEventListener("click", function() {
    if (shiftSectionOptionsToggle % 2 === 0) {
        shiftSectionOptions.className = ""
        shiftSectionOptionsToggle += 1

        synchronizeShiftsWidths()

    } else {
        shiftSectionOptions.className = "disappear"
        shiftSectionOptionsToggle += 1
    }
})

const saveShift = document.getElementById("shift-save-button")
const shiftInput = document.getElementById("shift-input")
let shiftList = document.getElementById("shift-list")
let shiftSectionList = document.getElementById("shift-section-list-wrapper")

const shiftListInDB = ref(database, "shiftList")
const shiftSectionsListInDB = ref(database, "shiftSectionsList")

const newShiftSection = document.getElementById("shift-section-input")
let shiftSectionDropdown = document.getElementById("shift-sections")
let shiftWarningMsg = document.getElementById("shift-warning-msg")

clearDropdown(shiftSectionDropdown)

saveShift.addEventListener("click", function() {
    let theShiftInput = shiftInput.value 
    let theNewShiftSection = newShiftSection.value
    let theShiftSectionFromDropdown = shiftSectionDropdown.options[shiftSectionDropdown.selectedIndex].text
    shiftWarningMsg.className = "disappear"

    if (theNewShiftSection === "" && theShiftSectionFromDropdown === "**Not Selected**") {
        
        push(shiftListInDB, theShiftInput)
        push(shiftSectionsListInDB, "**Not Selected**")
        shiftInput.value = ""
        newShiftSection.value = ""
        shiftSectionDropdown.selectedIndex = 0

        shiftInput.focus()
        
    } else if (theNewShiftSection != "" && theShiftSectionFromDropdown === "**Not Selected**") {
        
        push(shiftListInDB, theShiftInput)
        push(shiftSectionsListInDB, theNewShiftSection)
        shiftInput.value = ""
        newShiftSection.value = ""
        
        let length = shiftSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (shiftSectionDropdown.options[i].textContent === theNewShiftSection) {
                shiftSectionDropdown.selectedIndex = i
            }
        }

        shiftInput.focus()

    } else if (theNewShiftSection === "" && theShiftSectionFromDropdown != "**Not Selected**") {
        
        push(shiftListInDB, theShiftInput)
        push(shiftSectionsListInDB, theShiftSectionFromDropdown)
        shiftInput.value = ""
        newShiftSection.value = ""

        let length = shiftSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (shiftSectionDropdown.options[i].textContent === theShiftSectionFromDropdown) {
                shiftSectionDropdown.selectedIndex = i
            }
        }

        shiftInput.focus()

    } else {
        shiftWarningMsg.className = "warning-msg"
        setTimeout(function() {
            shiftWarningMsg.className = "disappear"
        }, 500)
        shiftSectionDropdown.focus()
    }
})


shiftInput.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveShift.click()
    }
})

newShiftSection.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveShift.click()
    }
})

shiftSectionDropdown.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveShift.click()
    }
})


onValue(shiftListInDB, function(snapshotNote) {
    onValue(shiftSectionsListInDB, function(snapshotNoteSection) {
        if (snapshotNote.exists()) {
            let notesArray = Object.entries(snapshotNote.val())
            let noteSectionsArray = Object.entries(snapshotNoteSection.val())



            // Create an array of objects containing the original values and their indices
            let combinedArray = noteSectionsArray.map((value, index) => ({ value, index }));

            // Sort the combined array based on the values
            combinedArray.sort((a, b) => {
                let stringA = a.value[1].toLowerCase();
                let stringB = b.value[1].toLowerCase();
                
                if (stringA < stringB) {
                    return -1;
                } else if (stringA > stringB) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // Rearrange both arrays based on the sorted indices
            noteSectionsArray = combinedArray.map(item => item.value);
            notesArray = combinedArray.map(item => notesArray[item.index]);





            shiftList.innerHTML = ""
            shiftSectionList.innerHTML = ""
            renderedShiftSections = []
            renderedShiftSectionsIDs = []

            clearDropdown(shiftSectionDropdown)

            theStoredShiftIDs = []
            theStoredShiftValues = []
            theStoredShiftSectionIDs = []
            theStoredShiftSectionValues = []

            for (let i = 0; i < notesArray.length; i++) {
                // let x = notesArray.length - 1 - i
                let noteItem = notesArray[i]
                let sectionItem = noteSectionsArray[i]

                renderShifts(noteItem, sectionItem)
            }
        } else {
            shiftSectionList.innerHTML = ""
            shiftList.innerHTML = "No notes here... yet"
        }
    })
})



let renderedShiftSections = []
let renderedShiftSectionsIDs = []
let thisShiftSectionToggleCounter = []

let numShiftItems = 0
let shiftDeleteHelper = 0 

let theStoredShiftIDs = []
let theStoredShiftValues = []
let theStoredShiftSectionIDs = []
let theStoredShiftSectionValues = []

function renderShifts(noteStored, sectionStored) {
    let noteID = noteStored[0]
    let noteValue = noteStored[1]

    let sectionID = sectionStored[0]
    let sectionValue = sectionStored[1]

    theStoredShiftIDs.push(noteID)
    theStoredShiftValues.push(noteValue)
    theStoredShiftSectionIDs.push(sectionID)
    theStoredShiftSectionValues.push(sectionValue)


    let newEl = document.createElement("li")
    newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`

    let deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `<button id='${noteID}' class='disappear'></button>`
    btnList.append(deleteBtn)

    if (sectionValue === "**Not Selected**") {
        shiftList.append(newEl)
    } else if (renderedShiftSections.includes(sectionValue)) {
        for (let i = 0; i < renderedShiftSections.length; i++) {
            if (renderedShiftSections[i] === sectionValue) {
                let thisSection = document.getElementById(`${renderedShiftSectionsIDs[i]}`)
                thisSection.append(newEl)
            }
        }

    } else {
        let theSectionList = document.createElement("ul")
        theSectionList.id = `${sectionID}`
        theSectionList.className = "disappear"

        let sectionHeader = document.createElement("li")
        sectionHeader.innerHTML = `<h3 id='${sectionID}-title' class="heading">${sectionValue}</h3>`
        shiftSectionList.append(sectionHeader)

        theSectionList.append(newEl)
        shiftSectionList.append(theSectionList)

        renderedShiftSections.push(sectionValue)
        renderedShiftSectionsIDs.push(sectionID)
        thisShiftSectionToggleCounter.push(0)
        let index = renderedShiftSections.length - 1

        let addToDropdown = document.createElement("option")
        addToDropdown.id = `${sectionID}-dropdown`
        addToDropdown.value = sectionID
        addToDropdown.text = sectionValue
        shiftSectionDropdown.append(addToDropdown)

        if (thisShiftSectionToggleCounter[index] % 2 != 0) {
            theSectionList.className = "sectionList"
        }

        sectionHeader.onclick = event => {
            if (event.detail === 1) {
                for (let i = 0; i < renderedShiftSections.length; i++) {
                    if (renderedShiftSections[i] === sectionValue) {
                        if (thisShiftSectionToggleCounter[i] % 2 === 0) {
                            theSectionList.className = "sectionList"
                            thisShiftSectionToggleCounter[i] += 1
                        } else {
                            theSectionList.className = "disappear"
                            thisShiftSectionToggleCounter[i] += 1
                        }
                    }
                }
            } else if (event.detail === 2) {

                thisShiftSectionToggleCounter[index] = 0

                if (shiftDeleteHelper === 0) {
                    for (let i = 0; i < theStoredShiftIDs.length; i++) {
                        if (theStoredShiftSectionValues[i] === sectionValue) {
                            numShiftItems += 1
                        }
                    }
                    shiftDeleteHelper = 1
                }

                while (numShiftItems > 0) {
                    for (let i = theStoredShiftIDs.length - 1; i >= 0; i--) {
                        if (theStoredShiftSectionValues[i] === sectionValue) {
                            let movingNoteID = theStoredShiftIDs[i]
                            let currentBtn = document.getElementById(`${movingNoteID}`)
                            currentBtn.click()
                            numShiftItems -= 1
                        }
                    }
                }

                numShiftItems = 0 
                shiftDeleteHelper = 0 
            } 
        }
    }

    newEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(noteValue)
            newEl.innerHTML = `<p style="white-space: pre-line">(Copied ✔️) ${noteValue}</p>`
            setTimeout(function() {
                newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            deleteBtn.click()
        }
    }

    deleteBtn.addEventListener("click", function() {
        push(archivedShiftListInDB, noteValue)
        push(archivedShiftSectionListInDB, sectionValue)

        let theShiftSectionFromDropdown = shiftSectionDropdown.options[shiftSectionDropdown.selectedIndex].text
        clearDropdown(shiftSectionDropdown)
        


        let exactLocationOfNoteInDB = ref(database, `shiftList/${noteID}`)
        remove(exactLocationOfNoteInDB)

        let thisLength = thisShiftSectionToggleCounter.length - 1
        thisShiftSectionToggleCounter.splice(thisLength, 1)


        let exactLocationOfSectionInDB = ref(database, `shiftSectionsList/${sectionID}`)
        remove(exactLocationOfSectionInDB)

        let thisSecondLength = thisShiftSectionToggleCounter.length - 1
        thisShiftSectionToggleCounter.splice(thisSecondLength, 1)



        let length = shiftSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (shiftSectionDropdown.options[i].textContent === theShiftSectionFromDropdown) {
                shiftSectionDropdown.selectedIndex = i
            }
        }

        for (let x = theStoredShiftIDs.length - 1; x >= 0; x--) {
            if (theStoredShiftIDs[x] === noteID) {
                theStoredShiftIDs.splice(x, 1)
                theStoredShiftValues.splice(x, 1)
                theStoredShiftSectionIDs.splice(x, 1)
                theStoredShiftSectionValues.splice(x, 1)
            }
        }


        for (let k = renderedShiftSections.length - 1; k >= 0; k--) {
            if (renderedShiftSections[k] === sectionValue) {
                let sectionTotalOccurences = 0
                for (let j = theStoredShiftSectionValues.length - 1; j >= 0; j--) {
                    if (theStoredShiftSectionValues[j] === sectionValue) {
                        sectionTotalOccurences += 1
                    }
                }

                if (sectionTotalOccurences === 0) {
                    thisShiftSectionToggleCounter.splice(k, 1)
                }
            }
        }
    })

    synchronizeShiftsWidths()

}





























// GENERAL NOTES SECTION

let generalTitle = document.querySelector("#saved-general-title")
let generalSection = document.querySelector("#general-notes-wrapper")
let generalToggle = 0

generalTitle.addEventListener("click", function() {
    if (generalToggle % 2 === 0) {
        generalSection.className = "version2-wrapper"
        generalToggle += 1
        generalNoteInput.focus()
    } else {
        generalSection.className = "disappear"
        generalToggle += 1
    }
})


let generalNoteSectionCheckbox = document.querySelector("#add-general-note-section-checkbox")
let generalNoteSectionOptions = document.querySelector("#general-note-section-options")
let generalNoteSectionOptionsToggle = 0

generalNoteSectionCheckbox.addEventListener("click", function() {
    if (generalNoteSectionOptionsToggle % 2 === 0) {
        generalNoteSectionOptions.className = ""
        generalNoteSectionOptionsToggle += 1

        synchronizeGeneralNotesWidths()

    } else {
        generalNoteSectionOptions.className = "disappear"
        generalNoteSectionOptionsToggle += 1
    }
})


const saveGeneralNote = document.getElementById("general-note-save-button")
const generalNoteInput = document.getElementById("general-note-input")
let generalNoteList = document.getElementById("general-notes-list")
let generalSectionList = document.getElementById("general-section-list-wrapper")

const generalNotesListInDB = ref(database, "generalNoteList")
const generalNoteSectionsListInDB = ref(database, "generalNoteSectionsList")

const newGeneralNoteSection = document.getElementById("general-note-section-input")
let generalNoteSectionDropdown = document.getElementById("general-notes-sections")
let generalNotesWarningMsg = document.getElementById("general-notes-warning-msg")

clearDropdown(generalNoteSectionDropdown)

saveGeneralNote.addEventListener("click", function() {
    let theGeneralNoteInput = generalNoteInput.value 
    let theNewGeneralNoteSection = newGeneralNoteSection.value
    let theGeneralNoteSectionFromDropdown = generalNoteSectionDropdown.options[generalNoteSectionDropdown.selectedIndex].text
    generalNotesWarningMsg.className = "disappear"

    if (theNewGeneralNoteSection === "" && theGeneralNoteSectionFromDropdown === "**Not Selected**") {
        
        push(generalNotesListInDB, theGeneralNoteInput)
        push(generalNoteSectionsListInDB, "**Not Selected**")
        generalNoteInput.value = ""
        newGeneralNoteSection.value = ""
        generalNoteSectionDropdown.selectedIndex = 0

        generalNoteInput.focus()

    } else if (theNewGeneralNoteSection != "" && theGeneralNoteSectionFromDropdown === "**Not Selected**") {
        
        push(generalNotesListInDB, theGeneralNoteInput)
        push(generalNoteSectionsListInDB, theNewGeneralNoteSection)
        generalNoteInput.value = ""
        newGeneralNoteSection.value = ""
        
        let length = generalNoteSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (generalNoteSectionDropdown.options[i].textContent === theNewGeneralNoteSection) {
                generalNoteSectionDropdown.selectedIndex = i
            }
        }

        generalNoteInput.focus()

    } else if (theNewGeneralNoteSection === "" && theGeneralNoteSectionFromDropdown != "**Not Selected**") {

        push(generalNotesListInDB, theGeneralNoteInput)
        push(generalNoteSectionsListInDB, theGeneralNoteSectionFromDropdown)
        generalNoteInput.value = ""
        newGeneralNoteSection.value = ""
        
        let length = generalNoteSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (generalNoteSectionDropdown.options[i].textContent === theGeneralNoteSectionFromDropdown) {
                generalNoteSectionDropdown.selectedIndex = i
            }
        }

        generalNoteInput.focus()

    } else {
        generalNotesWarningMsg.className = "warning-msg"
        setTimeout(function() {
            generalNotesWarningMsg.className = "disappear"
        }, 500)
        generalNoteSectionDropdown.focus()
    }
})

generalNoteInput.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveGeneralNote.click()
    }
})

newGeneralNoteSection.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveGeneralNote.click()
    }
})

generalNoteSectionDropdown.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveGeneralNote.click()
    }
})



onValue(generalNotesListInDB, function(snapshotNote) {
    onValue(generalNoteSectionsListInDB, function(snapshotNoteSection) {
        if (snapshotNote.exists()) {
            let notesArray = Object.entries(snapshotNote.val())
            let noteSectionsArray = Object.entries(snapshotNoteSection.val())



            // Create an array of objects containing the original values and their indices
            let combinedArray = noteSectionsArray.map((value, index) => ({ value, index }));

            // Sort the combined array based on the values
            combinedArray.sort((a, b) => {
                let stringA = a.value[1].toLowerCase();
                let stringB = b.value[1].toLowerCase();
                
                if (stringA < stringB) {
                    return -1;
                } else if (stringA > stringB) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // Rearrange both arrays based on the sorted indices
            noteSectionsArray = combinedArray.map(item => item.value);
            notesArray = combinedArray.map(item => notesArray[item.index]);





            generalNoteList.innerHTML = ""
            generalSectionList.innerHTML = ""
            renderedGeneralSections = []
            renderedGeneralSectionsIDs = []

            clearDropdown(generalNoteSectionDropdown)

            theStoredGeneralNoteIDs = []
            theStoredGeneralNoteValues = []
            theStoredGeneralNoteSectionIDs = []
            theStoredGeneralNoteSectionValues = []

            for (let i = 0; i < notesArray.length; i++) {
                // let x = notesArray.length - 1 - i
                let noteItem = notesArray[i]
                let sectionItem = noteSectionsArray[i]

                renderGeneralNotes(noteItem, sectionItem)
            }
        } else {
            generalSectionList.innerHTML = ""
            generalNoteList.innerHTML = "No general notes here... yet"
        }
    })
})


let renderedGeneralSections = []
let renderedGeneralSectionsIDs = []
let thisGeneralSectionToggleCounter = []

let numGeneralItems = 0
let generalNoteDeleteHelper = 0 

let theStoredGeneralNoteIDs = []
let theStoredGeneralNoteValues = []
let theStoredGeneralNoteSectionIDs = []
let theStoredGeneralNoteSectionValues = []

function renderGeneralNotes(noteStored, sectionStored) {
    let noteID = noteStored[0]
    let noteValue = noteStored[1]

    let sectionID = sectionStored[0]
    let sectionValue = sectionStored[1]

    theStoredGeneralNoteIDs.push(noteID)
    theStoredGeneralNoteValues.push(noteValue)
    theStoredGeneralNoteSectionIDs.push(sectionID)
    theStoredGeneralNoteSectionValues.push(sectionValue)


    let newEl = document.createElement("li")
    newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`

    let deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `<button id='${noteID}' class='disappear'></button>`
    btnList.append(deleteBtn)

    if (sectionValue === "**Not Selected**") {
        generalNoteList.append(newEl)
    } else if (renderedGeneralSections.includes(sectionValue)) {
        for (let i = 0; i < renderedGeneralSections.length; i++) {
            if (renderedGeneralSections[i] === sectionValue) {
                let thisSection = document.getElementById(`${renderedGeneralSectionsIDs[i]}`)
                thisSection.append(newEl)
            }
        }

    } else {
        let theSectionList = document.createElement("ul")
        theSectionList.id = `${sectionID}`
        theSectionList.className = "disappear"

        let sectionHeader = document.createElement("li")
        sectionHeader.innerHTML = `<h3 id='${sectionID}-title' class="heading">${sectionValue}</h3>`
        generalSectionList.append(sectionHeader)

        theSectionList.append(newEl)
        generalSectionList.append(theSectionList)

        renderedGeneralSections.push(sectionValue)
        renderedGeneralSectionsIDs.push(sectionID)
        thisGeneralSectionToggleCounter.push(0)
        let index = renderedGeneralSections.length - 1

        let addToDropdown = document.createElement("option")
        addToDropdown.id = `${sectionID}-dropdown`
        addToDropdown.value = sectionID
        addToDropdown.text = sectionValue
        generalNoteSectionDropdown.append(addToDropdown)

        if (thisGeneralSectionToggleCounter[index] % 2 != 0) {
            theSectionList.className = "sectionList"
        }

        sectionHeader.onclick = event => {
            if (event.detail === 1) {
                for (let i = 0; i < renderedGeneralSections.length; i++) {
                    if (renderedGeneralSections[i] === sectionValue) {
                        if (thisGeneralSectionToggleCounter[i] % 2 === 0) {
                            theSectionList.className = "sectionList"
                            thisGeneralSectionToggleCounter[i] += 1
                        } else {
                            theSectionList.className = "disappear"
                            thisGeneralSectionToggleCounter[i] += 1
                        }
                    }
                }
            } else if (event.detail === 2) {

                thisGeneralSectionToggleCounter[index] = 0

                if (generalNoteDeleteHelper === 0) {
                    for (let i = 0; i < theStoredGeneralNoteIDs.length; i++) {
                        if (theStoredGeneralNoteSectionValues[i] === sectionValue) {
                            numGeneralItems += 1
                        }
                    }
                    generalNoteDeleteHelper = 1
                }

                while (numGeneralItems > 0) {
                    for (let i = theStoredGeneralNoteIDs.length - 1; i >= 0; i--) {
                        if (theStoredGeneralNoteSectionValues[i] === sectionValue) {
                            let movingNoteID = theStoredGeneralNoteIDs[i]
                            let currentBtn = document.getElementById(`${movingNoteID}`)
                            currentBtn.click()
                            numGeneralItems -= 1
                        }
                    }
                }

                numGeneralItems = 0 
                generalNoteDeleteHelper = 0 
            } 
        }
    }

    newEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(noteValue)
            newEl.innerHTML = `<p style="white-space: pre-line">(Copied ✔️) ${noteValue}</p>`
            setTimeout(function() {
                newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            deleteBtn.click()
        }
    }

    deleteBtn.addEventListener("click", function() {
        push(archivedGeneralNotesListInDB, noteValue)
        push(archivedGeneralNotesSectionListInDB, sectionValue)

        let theGeneralNoteSectionFromDropdown = generalNoteSectionDropdown.options[generalNoteSectionDropdown.selectedIndex].text
        clearDropdown(generalNoteSectionDropdown)
        


        let exactLocationOfNoteInDB = ref(database, `generalNoteList/${noteID}`)
        remove(exactLocationOfNoteInDB)

        let thisLength = thisGeneralSectionToggleCounter.length - 1
        thisGeneralSectionToggleCounter.splice(thisLength, 1)


        let exactLocationOfSectionInDB = ref(database, `generalNoteSectionsList/${sectionID}`)
        remove(exactLocationOfSectionInDB)

        let thisSecondLength = thisGeneralSectionToggleCounter.length - 1
        thisGeneralSectionToggleCounter.splice(thisSecondLength, 1)



        let length = generalNoteSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (generalNoteSectionDropdown.options[i].textContent === theGeneralNoteSectionFromDropdown) {
                generalNoteSectionDropdown.selectedIndex = i
            }
        }

        for (let x = theStoredGeneralNoteIDs.length - 1; x >= 0; x--) {
            if (theStoredGeneralNoteIDs[x] === noteID) {
                theStoredGeneralNoteIDs.splice(x, 1)
                theStoredGeneralNoteValues.splice(x, 1)
                theStoredGeneralNoteSectionIDs.splice(x, 1)
                theStoredGeneralNoteSectionValues.splice(x, 1)
            }
        }


        for (let k = renderedGeneralSections.length - 1; k >= 0; k--) {
            if (renderedGeneralSections[k] === sectionValue) {
                let sectionTotalOccurences = 0
                for (let j = theStoredGeneralNoteSectionValues.length - 1; j >= 0; j--) {
                    if (theStoredGeneralNoteSectionValues[j] === sectionValue) {
                        sectionTotalOccurences += 1
                    }
                }

                if (sectionTotalOccurences === 0) {
                    thisGeneralSectionToggleCounter.splice(k, 1)
                }
            }
        }
    })

    synchronizeGeneralNotesWidths()

}





























// Template Section

let templateTitle = document.querySelector("#saved-template-title")
let templateSection = document.querySelector("#template-wrapper")
let templateToggle = 0

templateTitle.addEventListener("click", function() {
    if (templateToggle % 2 === 0) {
        templateSection.className = "version2-wrapper"
        templateToggle += 1
        templateInput.focus()
    } else {
        templateSection.className = "disappear"
        templateToggle += 1
    }
})


let templateSectionCheckbox = document.querySelector("#add-template-section-checkbox")
let templateSectionOptions = document.querySelector("#template-section-options")
let templateSectionOptionsToggle = 0

templateSectionCheckbox.addEventListener("click", function() {
    if (templateSectionOptionsToggle % 2 === 0) {
        templateSectionOptions.className = ""
        templateSectionOptionsToggle += 1

        synchronizeTemplateWidths()

    } else {
        templateSectionOptions.className = "disappear"
        templateSectionOptionsToggle += 1
    }
})


const saveTemplate = document.getElementById("template-save-button")
const templateInput = document.getElementById("template-input")
let templateList = document.getElementById("template-list")
let templateSectionList = document.getElementById("template-section-list-wrapper")

const templateListInDB = ref(database, "templateList")
const templateSectionsListInDB = ref(database, "templateSectionsList")

const newTemplateSection = document.getElementById("template-section-input")
let templateSectionDropdown = document.getElementById("template-sections")
let templateWarningMsg = document.getElementById("template-warning-msg")

clearDropdown(templateSectionDropdown)

saveTemplate.addEventListener("click", function() {
    let theTemplateInput = templateInput.value 
    let theNewTemplateSection = newTemplateSection.value
    let theTemplateSectionFromDropdown = templateSectionDropdown.options[templateSectionDropdown.selectedIndex].text
    templateWarningMsg.className = "disappear"

    if (theNewTemplateSection === "" && theTemplateSectionFromDropdown === "**Not Selected**") {
        
        push(templateListInDB, theTemplateInput)
        push(templateSectionsListInDB, "**Not Selected**")
        templateInput.value = ""
        newTemplateSection.value = ""
        templateSectionDropdown.selectedIndex = 0

        templateInput.focus()
        
    } else if (theNewTemplateSection != "" && theTemplateSectionFromDropdown === "**Not Selected**") {
        
        push(templateListInDB, theTemplateInput)
        push(templateSectionsListInDB, theNewTemplateSection)
        templateInput.value = ""
        newTemplateSection.value = ""
        
        let length = templateSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (templateSectionDropdown.options[i].textContent === theNewTemplateSection) {
                templateSectionDropdown.selectedIndex = i
            }
        }

        templateInput.focus()

    } else if (theNewTemplateSection === "" && theTemplateSectionFromDropdown != "**Not Selected**") {
        
        push(templateListInDB, theTemplateInput)
        push(templateSectionsListInDB, theTemplateSectionFromDropdown)
        templateInput.value = ""
        newTemplateSection.value = ""
        
        let length = templateSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (templateSectionDropdown.options[i].textContent === theTemplateSectionFromDropdown) {
                templateSectionDropdown.selectedIndex = i
            }
        }

        templateInput.focus()

    } else {
        templateWarningMsg.className = "warning-msg"
        setTimeout(function() {
            templateWarningMsg.className = "disappear"
        }, 500)
        templateSectionDropdown.focus()
    }
})

templateInput.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveTemplate.click()
    }
})

newTemplateSection.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveTemplate.click()
    }
})

templateSectionDropdown.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.shiftKey) {
        saveTemplate.click()
    }
})



onValue(templateListInDB, function(snapshotNote) {
    onValue(templateSectionsListInDB, function(snapshotNoteSection) {
        if (snapshotNote.exists()) {
            let notesArray = Object.entries(snapshotNote.val())
            let noteSectionsArray = Object.entries(snapshotNoteSection.val())



            // Create an array of objects containing the original values and their indices
            let combinedArray = noteSectionsArray.map((value, index) => ({ value, index }));

            // Sort the combined array based on the values
            combinedArray.sort((a, b) => {
                let stringA = a.value[1].toLowerCase();
                let stringB = b.value[1].toLowerCase();
                
                if (stringA < stringB) {
                    return -1;
                } else if (stringA > stringB) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // Rearrange both arrays based on the sorted indices
            noteSectionsArray = combinedArray.map(item => item.value);
            notesArray = combinedArray.map(item => notesArray[item.index]);




            templateList.innerHTML = ""
            templateSectionList.innerHTML = ""
            renderedTemplateSections = []
            renderedTemplateSectionsIDs = []

            clearDropdown(templateSectionDropdown)

            theStoredTemplateIDs = []
            theStoredTemplateValues = []
            theStoredTemplateSectionIDs = []
            theStoredTemplateSectionValues = []

            for (let i = 0; i < notesArray.length; i++) {
                // let x = notesArray.length - 1 - i
                let noteItem = notesArray[i]
                let sectionItem = noteSectionsArray[i]

                renderTemplates(noteItem, sectionItem)
            }
        } else {
            templateSectionList.innerHTML = ""
            templateList.innerHTML = "No templates here... yet"
        }
    })
})



let renderedTemplateSections = []
let renderedTemplateSectionsIDs = []
let thisTemplateSectionToggleCounter = []

let numTemplateItems = 0
let templateDeleteHelper = 0 

let theStoredTemplateIDs = []
let theStoredTemplateValues = []
let theStoredTemplateSectionIDs = []
let theStoredTemplateSectionValues = []

function renderTemplates(noteStored, sectionStored) {
    let noteID = noteStored[0]
    let noteValue = noteStored[1]

    let sectionID = sectionStored[0]
    let sectionValue = sectionStored[1]

    theStoredTemplateIDs.push(noteID)
    theStoredTemplateValues.push(noteValue)
    theStoredTemplateSectionIDs.push(sectionID)
    theStoredTemplateSectionValues.push(sectionValue)


    let newEl = document.createElement("li")
    newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`

    let deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `<button id='${noteID}' class='disappear'></button>`
    btnList.append(deleteBtn)

    if (sectionValue === "**Not Selected**") {
        templateList.append(newEl)
    } else if (renderedTemplateSections.includes(sectionValue)) {
        for (let i = 0; i < renderedTemplateSections.length; i++) {
            if (renderedTemplateSections[i] === sectionValue) {
                let thisSection = document.getElementById(`${renderedTemplateSectionsIDs[i]}`)
                thisSection.append(newEl)
            }
        }

    } else {
        let theSectionList = document.createElement("ul")
        theSectionList.id = `${sectionID}`
        theSectionList.className = "disappear"

        let sectionHeader = document.createElement("li")
        sectionHeader.innerHTML = `<h3 id='${sectionID}-title' class="heading">${sectionValue}</h3>`
        templateSectionList.append(sectionHeader)

        theSectionList.append(newEl)
        templateSectionList.append(theSectionList)

        renderedTemplateSections.push(sectionValue)
        renderedTemplateSectionsIDs.push(sectionID)
        thisTemplateSectionToggleCounter.push(0)
        let index = renderedTemplateSections.length - 1

        let addToDropdown = document.createElement("option")
        addToDropdown.id = `${sectionID}-dropdown`
        addToDropdown.value = sectionID
        addToDropdown.text = sectionValue
        templateSectionDropdown.append(addToDropdown)

        if (thisTemplateSectionToggleCounter[index] % 2 != 0) {
            theSectionList.className = "sectionList"
        }

        sectionHeader.onclick = event => {
            if (event.detail === 1) {
                for (let i = 0; i < renderedTemplateSections.length; i++) {
                    if (renderedTemplateSections[i] === sectionValue) {
                        if (thisTemplateSectionToggleCounter[i] % 2 === 0) {
                            theSectionList.className = "sectionList"
                            thisTemplateSectionToggleCounter[i] += 1
                        } else {
                            theSectionList.className = "disappear"
                            thisTemplateSectionToggleCounter[i] += 1
                        }
                    }
                }
            } else if (event.detail === 2) {

                thisTemplateSectionToggleCounter[index] = 0

                if (templateDeleteHelper === 0) {
                    for (let i = 0; i < theStoredTemplateIDs.length; i++) {
                        if (theStoredTemplateSectionValues[i] === sectionValue) {
                            numTemplateItems += 1
                        }
                    }
                    templateDeleteHelper = 1
                }

                while (numTemplateItems > 0) {
                    for (let i = theStoredTemplateIDs.length - 1; i >= 0; i--) {
                        if (theStoredTemplateSectionValues[i] === sectionValue) {
                            let movingNoteID = theStoredTemplateIDs[i]
                            let currentBtn = document.getElementById(`${movingNoteID}`)
                            currentBtn.click()
                            numTemplateItems -= 1
                        }
                    }
                }

                numTemplateItems = 0 
                templateDeleteHelper = 0 
            } 
        }
    }

    newEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(noteValue)
            newEl.innerHTML = `<p style="white-space: pre-line">(Copied ✔️) ${noteValue}</p>`
            setTimeout(function() {
                newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            deleteBtn.click()
        }
    }

    deleteBtn.addEventListener("click", function() {
        push(archivedTemplateListInDB, noteValue)
        push(archivedTemplateSectionListInDB, sectionValue)

        let theTemplateSectionFromDropdown = templateSectionDropdown.options[templateSectionDropdown.selectedIndex].text
        clearDropdown(templateSectionDropdown)
        


        let exactLocationOfNoteInDB = ref(database, `templateList/${noteID}`)
        remove(exactLocationOfNoteInDB)

        let thisLength = thisTemplateSectionToggleCounter.length - 1
        thisTemplateSectionToggleCounter.splice(thisLength, 1)


        let exactLocationOfSectionInDB = ref(database, `templateSectionsList/${sectionID}`)
        remove(exactLocationOfSectionInDB)

        let thisSecondLength = thisTemplateSectionToggleCounter.length - 1
        thisTemplateSectionToggleCounter.splice(thisSecondLength, 1)



        let length = templateSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (templateSectionDropdown.options[i].textContent === theTemplateSectionFromDropdown) {
                templateSectionDropdown.selectedIndex = i
            }
        }

        for (let x = theStoredTemplateIDs.length - 1; x >= 0; x--) {
            if (theStoredTemplateIDs[x] === noteID) {
                theStoredTemplateIDs.splice(x, 1)
                theStoredTemplateValues.splice(x, 1)
                theStoredTemplateSectionIDs.splice(x, 1)
                theStoredTemplateSectionValues.splice(x, 1)
            }
        }


        for (let k = renderedTemplateSections.length - 1; k >= 0; k--) {
            if (renderedTemplateSections[k] === sectionValue) {
                let sectionTotalOccurences = 0
                for (let j = theStoredTemplateSectionValues.length - 1; j >= 0; j--) {
                    if (theStoredTemplateSectionValues[j] === sectionValue) {
                        sectionTotalOccurences += 1
                    }
                }

                if (sectionTotalOccurences === 0) {
                    thisTemplateSectionToggleCounter.splice(k, 1)
                }
            }
        }
    })

    synchronizeTemplateWidths()

}



























// Archive Section:


let archivedLoginsTitle = document.querySelector("#archived-passwords-title")
let archivedLoginsSection = document.querySelector("#archived-password-wrapper")

let archivedPlatform = document.querySelector("#archived-platform-information")
let archivedUsername = document.querySelector("#archived-username-information")
let archivedPassword = document.querySelector("#archived-password-information")
let archivedLoginsToggle = 0

archivedLoginsTitle.addEventListener("click", function() {
    if (archivedLoginsToggle % 2 === 0) {
        archivedLoginsSection.className = ""
        archivedPlatform.className = "section"
        archivedUsername.className = "section"
        archivedPassword.className = "section"
        archivedLoginsTitle.innerHTML = "Archive ⬇"
        archivedLoginsToggle += 1
    } else {
        archivedLoginsSection.className = "disappear"
        archivedPlatform.className = "disappear"
        archivedUsername.className = "disappear"
        archivedPassword.className = "disappear"
        archivedLoginsTitle.innerHTML = "Archive"
        archivedLoginsToggle += 1
    }
})



let archivedNotesTitle = document.querySelector("#archived-notes-title")
let archivedNotesSection = document.querySelector("#archived-notes-wrapper")
let archivedNotesToggle = 0
// ⬇

archivedNotesTitle.addEventListener("click", function() {
    if (archivedNotesToggle % 2 === 0) {
        archivedNotesSection.className = ""
        archivedNotesTitle.innerHTML = "Archive ⬇"
        archivedNotesToggle += 1
    } else {
        archivedNotesSection.className = "disappear"
        archivedNotesTitle.innerHTML = "Archive"
        archivedNotesToggle += 1
    }
})

let archivedShiftTitle = document.querySelector("#archived-shift-title")
let archivedShiftSection = document.querySelector("#archived-shift-wrapper")
let archivedShiftToggle = 0

archivedShiftTitle.addEventListener("click", function() {
    if (archivedShiftToggle % 2 === 0) {
        archivedShiftSection.className = ""
        archivedShiftTitle.innerHTML = "Archive ⬇"
        archivedShiftToggle += 1
    } else {
        archivedShiftSection.className = "disappear"
        archivedShiftTitle.innerHTML = "Archive"
        archivedShiftToggle += 1
    }
})




let archivedGeneralNotesTitle = document.querySelector("#archived-general-notes-title")
let archivedGeneralNotesSection = document.querySelector("#archived-general-notes-wrapper")
let archivedGeneralNotesToggle = 0

archivedGeneralNotesTitle.addEventListener("click", function() {
    if (archivedGeneralNotesToggle % 2 === 0) {
        archivedGeneralNotesSection.className = ""
        archivedGeneralNotesTitle.innerHTML = "Archive ⬇"
        archivedGeneralNotesToggle += 1
    } else {
        archivedGeneralNotesSection.className = "disappear"
        archivedGeneralNotesTitle.innerHTML = "Archive"
        archivedGeneralNotesToggle += 1
    }
})


let archivedTemplatesTitle = document.querySelector("#archived-template-title")
let archivedTemplatesSection = document.querySelector("#archived-template-wrapper")
let archivedTemplatesToggle = 0

archivedTemplatesTitle.addEventListener("click", function() {
    if (archivedTemplatesToggle % 2 === 0) {
        archivedTemplatesSection.className = ""
        archivedTemplatesTitle.innerHTML = "Archive ⬇"
        archivedTemplatesToggle += 1
    } else {
        archivedTemplatesSection.className = "disappear"
        archivedTemplatesTitle.innerHTML = "Archive"
        archivedTemplatesToggle += 1
    }
})




const archivedPlatformListInDB = ref(database, "archivedPlatformList")
const archivedUsernameListInDB = ref(database, "archivedUsernameList")
const archivedPasswordListInDB = ref(database, "archivedPasswordList")

let archivedPlatformDisplayList = document.getElementById("archived-platform-list")
let archivedUsernameDisplayList = document.getElementById("archived-username-list")
let archivedPasswordDisplayList = document.getElementById("archived-password-list")


onValue(archivedPlatformListInDB, function(snapshotArchivedPlatformList) {
    onValue(archivedUsernameListInDB, function(snapshotArchivedUsernameList) {
        onValue(archivedPasswordListInDB, function(snapshotArchivedPasswordList) {
            if (snapshotArchivedPlatformList.exists()) {
                let archivedPlatformArray = Object.entries(snapshotArchivedPlatformList.val())
                let archivedUsernameArray = Object.entries(snapshotArchivedUsernameList.val())
                let archivedPasswordArray = Object.entries(snapshotArchivedPasswordList.val())

                clearArchivedGroupListEl()

                for (let i = 0; i < archivedPlatformArray.length; i++) {
                    let x = archivedPlatformArray.length - 1 - i
                    let archivedPlatformItem = archivedPlatformArray[x]
                    let archivedUsernameItem = archivedUsernameArray[x]
                    let archivedPasswordItem = archivedPasswordArray[x]

                    renderArchive(archivedPlatformItem, archivedUsernameItem, archivedPasswordItem)
                }
            } else {
                archivedPlatformDisplayList.innerHTML = "No archived logins"
                archivedUsernameDisplayList.innerHTML = ""
                archivedPasswordDisplayList.innerHTML = ""
            }
        })
    })
})


function clearArchivedGroupListEl() {
    archivedPlatformDisplayList.innerHTML = ""
    archivedUsernameDisplayList.innerHTML = ""
    archivedPasswordDisplayList.innerHTML = ""
}


function renderArchive(platformStored, usernameStored, passwordStored) {
    let platformID = platformStored[0]
    let platformValue = platformStored[1]

    let usernameID = usernameStored[0]
    let usernameValue = usernameStored[1]

    let passwordID = passwordStored[0]
    let passwordValue = passwordStored[1]



    let archivedPlatformEl = document.createElement("li")
    archivedPlatformEl.innerHTML = `<p class='table-element'>${platformValue}</p>`
    archivedPlatformDisplayList.append(archivedPlatformEl)

    let archivedUsernameEl = document.createElement("li")
    archivedUsernameEl.innerHTML = `<p class='table-element'>${usernameValue}</p>`
    archivedUsernameDisplayList.append(archivedUsernameEl)


    let archivedPasswordEl = document.createElement("li")
    archivedPasswordEl.innerHTML = `<p id='password' class='table-element'>${passwordValue}</p>`
    archivedPasswordDisplayList.append(archivedPasswordEl)



    archivedPlatformEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(platformValue)
            archivedPlatformEl.innerHTML = `<p class='table-element' style="white-space: pre-line">Copied ✔️</p>`
            setTimeout(function() {
                archivedPlatformEl.innerHTML = `<p class='table-element' style="white-space: pre-line">${platformValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            let exactLocationOfArchivedPlatformInDB = ref(database, `archivedPlatformList/${platformID}`)
            let exactLocationOfArchivedUsernameInDB = ref(database, `archivedUsernameList/${usernameID}`)
            let exactLocationOfArchivedPasswordInDB = ref(database, `archivedPasswordList/${passwordID}`)
    
            remove(exactLocationOfArchivedPlatformInDB)
            remove(exactLocationOfArchivedUsernameInDB)
            remove(exactLocationOfArchivedPasswordInDB)
        } 
    }


    archivedUsernameEl.addEventListener("click", function() {
        navigator.clipboard.writeText(usernameValue)
        archivedUsernameEl.innerHTML = `<p class='table-element'>Copied ✔️</p>`
        setTimeout(function() {
            archivedUsernameEl.innerHTML = `<p class='table-element'>${usernameValue}</p>`
        }, 500)
    })

    archivedPasswordEl.addEventListener("click", function() {
        navigator.clipboard.writeText(passwordValue)
        archivedPasswordEl.innerHTML = `<p class='table-element'>Copied ✔️</p>`
        setTimeout(function() {
            archivedPasswordEl.innerHTML = `<p id='password' class='table-element'>${passwordValue}</p>`
        }, 500)
    })
}



































// ARCHIVED NOTES SECTION

let archivedNoteList = document.getElementById("archived-notes-list")
let archivedSectionList = document.getElementById("archived-section-list-wrapper")

const archivedNotesListInDB = ref(database, "archiveNoteList")
const archivedNoteSectionsListInDB = ref(database, "archiveNoteSectionsList")


onValue(archivedNotesListInDB, function(snapshotArchiveNote) {
    onValue(archivedNoteSectionsListInDB, function(snapshotArchiveNoteSection) {
        if (snapshotArchiveNote.exists()) {
            let notesArray = Object.entries(snapshotArchiveNote.val())
            let noteSectionsArray = Object.entries(snapshotArchiveNoteSection.val())


            archivedNoteList.innerHTML = ""
            archivedSectionList.innerHTML = ""
            renderedArchiveSections = []
            renderedArchiveSectionsIDs = []

            theArchiveNoteIDs = []
            theArchiveNoteValues = []
            theArchiveNoteSectionIDs = []
            theArchiveNoteSectionValues = []

            for (let i = 0; i < notesArray.length; i++) {
                let x = notesArray.length - 1 - i
                let noteItem = notesArray[x]
                let sectionItem = noteSectionsArray[x]

                renderArchiveNotes(noteItem, sectionItem)
            }
        } else {
            archivedSectionList.innerHTML = ""
            archivedNoteList.innerHTML = "No archived daily tasks here..."
        }
    })
})


let renderedArchiveSections = []
let renderedArchiveSectionsIDs = []
let thisArchiveSectionToggleCounter = []

let numArchiveItems = 0
let archiveNoteDeleteHelper = 0 

let theArchiveNoteIDs = []
let theArchiveNoteValues = []
let theArchiveNoteSectionIDs = []
let theArchiveNoteSectionValues = []

function renderArchiveNotes(noteStored, sectionStored) {
    let noteID = noteStored[0]
    let noteValue = noteStored[1]

    let sectionID = sectionStored[0]
    let sectionValue = sectionStored[1]

    theArchiveNoteIDs.push(noteID)
    theArchiveNoteValues.push(noteValue)
    theArchiveNoteSectionIDs.push(sectionID)
    theArchiveNoteSectionValues.push(sectionValue)


    let newEl = document.createElement("li")
    newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`

    let deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `<button id='${noteID}' class='disappear'></button>`
    btnList.append(deleteBtn)

    if (sectionValue === "**Not Selected**") {
        archivedNoteList.append(newEl)
    } else if (renderedArchiveSections.includes(sectionValue)) {
        for (let i = 0; i < renderedArchiveSections.length; i++) {
            if (renderedArchiveSections[i] === sectionValue) {
                let thisSection = document.getElementById(`${renderedArchiveSectionsIDs[i]}`)
                thisSection.append(newEl)
            }
        }

    } else {
        let theSectionList = document.createElement("ul")
        theSectionList.id = `${sectionID}`
        theSectionList.className = "disappear"

        let sectionHeader = document.createElement("li")
        sectionHeader.innerHTML = `<h3 id='${sectionID}-title' class="heading">${sectionValue}</h3>`
        archivedSectionList.append(sectionHeader)

        theSectionList.append(newEl)
        archivedSectionList.append(theSectionList)

        renderedArchiveSections.push(sectionValue)
        renderedArchiveSectionsIDs.push(sectionID)
        thisArchiveSectionToggleCounter.push(0)
        let index = renderedArchiveSections.length - 1


        if (thisArchiveSectionToggleCounter[index] % 2 != 0) {
            theSectionList.className = "sectionList"
        }

        sectionHeader.onclick = event => {
            if (event.detail === 1) {
                for (let i = 0; i < renderedArchiveSections.length; i++) {
                    if (renderedArchiveSections[i] === sectionValue) {
                        if (thisArchiveSectionToggleCounter[i] % 2 === 0) {
                            theSectionList.className = "sectionList"
                            thisArchiveSectionToggleCounter[i] += 1
                        } else {
                            theSectionList.className = "disappear"
                            thisArchiveSectionToggleCounter[i] += 1
                        }
                    }
                }
            } else if (event.detail === 2) {

                thisArchiveSectionToggleCounter[index] = 0

                if (archiveNoteDeleteHelper === 0) {
                    for (let i = 0; i < theArchiveNoteIDs.length; i++) {
                        if (theArchiveNoteSectionValues[i] === sectionValue) {
                            numArchiveItems += 1
                        }
                    }
                    archiveNoteDeleteHelper = 1
                }

                while (numArchiveItems > 0) {
                    for (let i = theArchiveNoteIDs.length - 1; i >= 0; i--) {
                        if (theArchiveNoteSectionValues[i] === sectionValue) {
                            let movingNoteID = theArchiveNoteIDs[i]
                            let currentBtn = document.getElementById(`${movingNoteID}`)
                            currentBtn.click()
                            numArchiveItems -= 1
                        }
                    }
                }

                numArchiveItems = 0 
                archiveNoteDeleteHelper = 0 
            } 
        }
    }

    newEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(noteValue)
            newEl.innerHTML = `<p style="white-space: pre-line">(Copied ✔️) ${noteValue}</p>`
            setTimeout(function() {
                newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            let exactLocationOfNoteInDB = ref(database, `archiveNoteList/${noteID}`)
            remove(exactLocationOfNoteInDB)

            let thisLength = thisArchiveSectionToggleCounter.length - 1
            thisArchiveSectionToggleCounter.splice(thisLength, 1)


            let exactLocationOfSectionInDB = ref(database, `archiveNoteSectionsList/${sectionID}`)
            remove(exactLocationOfSectionInDB)

            let thisSecondLength = thisArchiveSectionToggleCounter.length - 1
            thisArchiveSectionToggleCounter.splice(thisSecondLength, 1)


            for (let x = theArchiveNoteIDs.length - 1; x >= 0; x--) {
                if (theArchiveNoteIDs[x] === noteID) {
                    theArchiveNoteIDs.splice(x, 1)
                    theArchiveNoteValues.splice(x, 1)
                    theArchiveNoteSectionIDs.splice(x, 1)
                    theArchiveNoteSectionValues.splice(x, 1)
                }
            }


            for (let k = renderedArchiveSections.length - 1; k >= 0; k--) {
                if (renderedArchiveSections[k] === sectionValue) {
                    let sectionTotalOccurences = 0
                    for (let j = theArchiveNoteSectionValues.length - 1; j >= 0; j--) {
                        if (theArchiveNoteSectionValues[j] === sectionValue) {
                            sectionTotalOccurences += 1
                        }
                    }

                    if (sectionTotalOccurences === 0) {
                        thisArchiveSectionToggleCounter.splice(k, 1)
                    }
                }
            }
        }
    }

    deleteBtn.addEventListener("click", function() {
        let theNoteSectionFromDropdown = noteSectionDropdown.options[noteSectionDropdown.selectedIndex].text
        clearDropdown(noteSectionDropdown)
        
        push(notesListInDB, noteValue)
        push(noteSectionsListInDB, sectionValue)
        


        let exactLocationOfNoteInDB = ref(database, `archiveNoteList/${noteID}`)
        remove(exactLocationOfNoteInDB)

        let thisLength = thisArchiveSectionToggleCounter.length - 1
        thisArchiveSectionToggleCounter.splice(thisLength, 1)


        let exactLocationOfSectionInDB = ref(database, `archiveNoteSectionsList/${sectionID}`)
        remove(exactLocationOfSectionInDB)

        let thisSecondLength = thisArchiveSectionToggleCounter.length - 1
        thisArchiveSectionToggleCounter.splice(thisSecondLength, 1)



        let length = noteSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (noteSectionDropdown.options[i].textContent === theNoteSectionFromDropdown) {
                noteSectionDropdown.selectedIndex = i
            }
        }

        for (let x = theArchiveNoteIDs.length - 1; x >= 0; x--) {
            if (theArchiveNoteIDs[x] === noteID) {
                theArchiveNoteIDs.splice(x, 1)
                theArchiveNoteValues.splice(x, 1)
                theArchiveNoteSectionIDs.splice(x, 1)
                theArchiveNoteSectionValues.splice(x, 1)
            }
        }


        for (let k = renderedArchiveSections.length - 1; k >= 0; k--) {
            if (renderedArchiveSections[k] === sectionValue) {
                let sectionTotalOccurences = 0
                for (let j = theArchiveNoteSectionValues.length - 1; j >= 0; j--) {
                    if (theArchiveNoteSectionValues[j] === sectionValue) {
                        sectionTotalOccurences += 1
                    }
                }

                if (sectionTotalOccurences === 0) {
                    thisArchiveSectionToggleCounter.splice(k, 1)
                }
            }
        }
    })
}



















// ARCHIVED SHIFTS 


let archivedShiftList = document.getElementById("archived-shift-list")
let archivedShiftSectionList = document.getElementById("archived-shift-section-list-wrapper")
const archivedShiftListInDB = ref(database, "archivedShiftList")
const archivedShiftSectionListInDB = ref(database, "archivedShiftSectionList")


onValue(archivedShiftListInDB, function(snapshotArchiveNote) {
    onValue(archivedShiftSectionListInDB, function(snapshotArchiveNoteSection) {
        if (snapshotArchiveNote.exists()) {
            let notesArray = Object.entries(snapshotArchiveNote.val())
            let noteSectionsArray = Object.entries(snapshotArchiveNoteSection.val())


            archivedShiftList.innerHTML = ""
            archivedShiftSectionList.innerHTML = ""
            renderedArchiveShiftSections = []
            renderedArchiveShiftSectionsIDs = []

            theArchiveShiftIDs = []
            theArchiveShiftValues = []
            theArchiveShiftSectionIDs = []
            theArchiveShiftSectionValues = []

            for (let i = 0; i < notesArray.length; i++) {
                let x = notesArray.length - 1 - i
                let noteItem = notesArray[x]
                let sectionItem = noteSectionsArray[x]

                renderArchiveShift(noteItem, sectionItem)
            }
        } else {
            archivedShiftSectionList.innerHTML = ""
            archivedShiftList.innerHTML = "No archived notes here..."
        }
    })
})


let renderedArchiveShiftSections = []
let renderedArchiveShiftSectionsIDs = []
let thisArchiveShiftSectionToggleCounter = []

let numArchiveShiftItems = 0
let archiveShiftDeleteHelper = 0 

let theArchiveShiftIDs = []
let theArchiveShiftValues = []
let theArchiveShiftSectionIDs = []
let theArchiveShiftSectionValues = []

function renderArchiveShift(noteStored, sectionStored) {
    let noteID = noteStored[0]
    let noteValue = noteStored[1]

    let sectionID = sectionStored[0]
    let sectionValue = sectionStored[1]

    theArchiveShiftIDs.push(noteID)
    theArchiveShiftValues.push(noteValue)
    theArchiveShiftSectionIDs.push(sectionID)
    theArchiveShiftSectionValues.push(sectionValue)


    let newEl = document.createElement("li")
    newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`

    let deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `<button id='${noteID}' class='disappear'></button>`
    btnList.append(deleteBtn)

    if (sectionValue === "**Not Selected**") {
        archivedShiftList.append(newEl)
    } else if (renderedArchiveShiftSections.includes(sectionValue)) {
        for (let i = 0; i < renderedArchiveShiftSections.length; i++) {
            if (renderedArchiveShiftSections[i] === sectionValue) {
                let thisSection = document.getElementById(`${renderedArchiveShiftSectionsIDs[i]}`)
                thisSection.append(newEl)
            }
        }

    } else {
        let theSectionList = document.createElement("ul")
        theSectionList.id = `${sectionID}`
        theSectionList.className = "disappear"

        let sectionHeader = document.createElement("li")
        sectionHeader.innerHTML = `<h3 id='${sectionID}-title' class="heading">${sectionValue}</h3>`
        archivedShiftSectionList.append(sectionHeader)

        theSectionList.append(newEl)
        archivedShiftSectionList.append(theSectionList)

        renderedArchiveShiftSections.push(sectionValue)
        renderedArchiveShiftSectionsIDs.push(sectionID)
        thisArchiveShiftSectionToggleCounter.push(0)
        let index = renderedArchiveShiftSections.length - 1


        if (thisArchiveShiftSectionToggleCounter[index] % 2 != 0) {
            theSectionList.className = "sectionList"
        }

        sectionHeader.onclick = event => {
            if (event.detail === 1) {
                for (let i = 0; i < renderedArchiveShiftSections.length; i++) {
                    if (renderedArchiveShiftSections[i] === sectionValue) {
                        if (thisArchiveShiftSectionToggleCounter[i] % 2 === 0) {
                            theSectionList.className = "sectionList"
                            thisArchiveShiftSectionToggleCounter[i] += 1
                        } else {
                            theSectionList.className = "disappear"
                            thisArchiveShiftSectionToggleCounter[i] += 1
                        }
                    }
                }
            } else if (event.detail === 2) {

                thisArchiveShiftSectionToggleCounter[index] = 0

                if (archiveShiftDeleteHelper === 0) {
                    for (let i = 0; i < theArchiveShiftIDs.length; i++) {
                        if (theArchiveShiftSectionValues[i] === sectionValue) {
                            numArchiveShiftItems += 1
                        }
                    }
                    archiveShiftDeleteHelper = 1
                }

                while (numArchiveShiftItems > 0) {
                    for (let i = theArchiveShiftIDs.length - 1; i >= 0; i--) {
                        if (theArchiveShiftSectionValues[i] === sectionValue) {
                            let movingNoteID = theArchiveShiftIDs[i]
                            let currentBtn = document.getElementById(`${movingNoteID}`)
                            currentBtn.click()
                            numArchiveShiftItems -= 1
                        }
                    }
                }

                numArchiveShiftItems = 0 
                archiveShiftDeleteHelper = 0 
            } 
        }
    }

    newEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(noteValue)
            newEl.innerHTML = `<p style="white-space: pre-line">(Copied ✔️) ${noteValue}</p>`
            setTimeout(function() {
                newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            let exactLocationOfNoteInDB = ref(database, `archivedShiftList/${noteID}`)
            remove(exactLocationOfNoteInDB)

            let thisLength = thisArchiveShiftSectionToggleCounter.length - 1
            thisArchiveShiftSectionToggleCounter.splice(thisLength, 1)


            let exactLocationOfSectionInDB = ref(database, `archivedShiftSectionList/${sectionID}`)
            remove(exactLocationOfSectionInDB)

            let thisSecondLength = thisArchiveShiftSectionToggleCounter.length - 1
            thisArchiveShiftSectionToggleCounter.splice(thisSecondLength, 1)


            for (let x = theArchiveShiftIDs.length - 1; x >= 0; x--) {
                if (theArchiveShiftIDs[x] === noteID) {
                    theArchiveShiftIDs.splice(x, 1)
                    theArchiveShiftValues.splice(x, 1)
                    theArchiveShiftSectionIDs.splice(x, 1)
                    theArchiveShiftSectionValues.splice(x, 1)
                }
            }


            for (let k = renderedArchiveShiftSections.length - 1; k >= 0; k--) {
                if (renderedArchiveShiftSections[k] === sectionValue) {
                    let sectionTotalOccurences = 0
                    for (let j = theArchiveShiftSectionValues.length - 1; j >= 0; j--) {
                        if (theArchiveShiftSectionValues[j] === sectionValue) {
                            sectionTotalOccurences += 1
                        }
                    }

                    if (sectionTotalOccurences === 0) {
                        thisArchiveShiftSectionToggleCounter.splice(k, 1)
                    }
                }
            }
        }
    }

    deleteBtn.addEventListener("click", function() {
        let theShiftSectionFromDropdown = shiftSectionDropdown.options[shiftSectionDropdown.selectedIndex].text
        clearDropdown(shiftSectionDropdown)
        
        push(shiftListInDB, noteValue)
        push(shiftSectionsListInDB, sectionValue)
        


        let exactLocationOfNoteInDB = ref(database, `archivedShiftList/${noteID}`)
        remove(exactLocationOfNoteInDB)

        let thisLength = thisArchiveShiftSectionToggleCounter.length - 1
        thisArchiveShiftSectionToggleCounter.splice(thisLength, 1)


        let exactLocationOfSectionInDB = ref(database, `archivedShiftSectionList/${sectionID}`)
        remove(exactLocationOfSectionInDB)

        let thisSecondLength = thisArchiveShiftSectionToggleCounter.length - 1
        thisArchiveShiftSectionToggleCounter.splice(thisSecondLength, 1)



        let length = shiftSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (shiftSectionDropdown.options[i].textContent === theShiftSectionFromDropdown) {
                shiftSectionDropdown.selectedIndex = i
            }
        }

        for (let x = theArchiveShiftIDs.length - 1; x >= 0; x--) {
            if (theArchiveShiftIDs[x] === noteID) {
                theArchiveShiftIDs.splice(x, 1)
                theArchiveShiftValues.splice(x, 1)
                theArchiveShiftSectionIDs.splice(x, 1)
                theArchiveShiftSectionValues.splice(x, 1)
            }
        }


        for (let k = renderedArchiveShiftSections.length - 1; k >= 0; k--) {
            if (renderedArchiveShiftSections[k] === sectionValue) {
                let sectionTotalOccurences = 0
                for (let j = theArchiveShiftSectionValues.length - 1; j >= 0; j--) {
                    if (theArchiveShiftSectionValues[j] === sectionValue) {
                        sectionTotalOccurences += 1
                    }
                }

                if (sectionTotalOccurences === 0) {
                    thisArchiveShiftSectionToggleCounter.splice(k, 1)
                }
            }
        }
    })
}





















// ARCHIVED GENERAL NOTES


let archivedGeneralNoteList = document.getElementById("archived-general-notes-list")
let archivedGeneralSectionList = document.getElementById("archived-general-section-list-wrapper")
const archivedGeneralNotesListInDB = ref(database, "archivedGeneralNoteList")
const archivedGeneralNotesSectionListInDB = ref(database, "archivedGeneralNoteSectionList")


onValue(archivedGeneralNotesListInDB, function(snapshotArchiveNote) {
    onValue(archivedGeneralNotesSectionListInDB, function(snapshotArchiveNoteSection) {
        if (snapshotArchiveNote.exists()) {
            let notesArray = Object.entries(snapshotArchiveNote.val())
            let noteSectionsArray = Object.entries(snapshotArchiveNoteSection.val())


            archivedGeneralNoteList.innerHTML = ""
            archivedGeneralSectionList.innerHTML = ""
            renderedArchiveGeneralSections = []
            renderedArchiveGeneralSectionsIDs = []

            theArchiveGeneralNoteIDs = []
            theArchiveGeneralNoteValues = []
            theArchiveGeneralNoteSectionIDs = []
            theArchiveGeneralNoteSectionValues = []

            for (let i = 0; i < notesArray.length; i++) {
                let x = notesArray.length - 1 - i
                let noteItem = notesArray[x]
                let sectionItem = noteSectionsArray[x]

                renderArchiveGeneralNotes(noteItem, sectionItem)
            }
        } else {
            archivedGeneralSectionList.innerHTML = ""
            archivedGeneralNoteList.innerHTML = "No archived general notes here..."
        }
    })
})


let renderedArchiveGeneralSections = []
let renderedArchiveGeneralSectionsIDs = []
let thisArchiveGeneralSectionToggleCounter = []

let numArchiveGeneralItems = 0
let archiveGeneralNoteDeleteHelper = 0 

let theArchiveGeneralNoteIDs = []
let theArchiveGeneralNoteValues = []
let theArchiveGeneralNoteSectionIDs = []
let theArchiveGeneralNoteSectionValues = []

function renderArchiveGeneralNotes(noteStored, sectionStored) {
    let noteID = noteStored[0]
    let noteValue = noteStored[1]

    let sectionID = sectionStored[0]
    let sectionValue = sectionStored[1]

    theArchiveGeneralNoteIDs.push(noteID)
    theArchiveGeneralNoteValues.push(noteValue)
    theArchiveGeneralNoteSectionIDs.push(sectionID)
    theArchiveGeneralNoteSectionValues.push(sectionValue)


    let newEl = document.createElement("li")
    newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`

    let deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `<button id='${noteID}' class='disappear'></button>`
    btnList.append(deleteBtn)

    if (sectionValue === "**Not Selected**") {
        archivedGeneralNoteList.append(newEl)
    } else if (renderedArchiveGeneralSections.includes(sectionValue)) {
        for (let i = 0; i < renderedArchiveGeneralSections.length; i++) {
            if (renderedArchiveGeneralSections[i] === sectionValue) {
                let thisSection = document.getElementById(`${renderedArchiveGeneralSectionsIDs[i]}`)
                thisSection.append(newEl)
            }
        }

    } else {
        let theSectionList = document.createElement("ul")
        theSectionList.id = `${sectionID}`
        theSectionList.className = "disappear"

        let sectionHeader = document.createElement("li")
        sectionHeader.innerHTML = `<h3 id='${sectionID}-title' class="heading">${sectionValue}</h3>`
        archivedGeneralSectionList.append(sectionHeader)

        theSectionList.append(newEl)
        archivedGeneralSectionList.append(theSectionList)

        renderedArchiveGeneralSections.push(sectionValue)
        renderedArchiveGeneralSectionsIDs.push(sectionID)
        thisArchiveGeneralSectionToggleCounter.push(0)
        let index = renderedArchiveGeneralSections.length - 1


        if (thisArchiveGeneralSectionToggleCounter[index] % 2 != 0) {
            theSectionList.className = "sectionList"
        }

        sectionHeader.onclick = event => {
            if (event.detail === 1) {
                for (let i = 0; i < renderedArchiveGeneralSections.length; i++) {
                    if (renderedArchiveGeneralSections[i] === sectionValue) {
                        if (thisArchiveGeneralSectionToggleCounter[i] % 2 === 0) {
                            theSectionList.className = "sectionList"
                            thisArchiveGeneralSectionToggleCounter[i] += 1
                        } else {
                            theSectionList.className = "disappear"
                            thisArchiveGeneralSectionToggleCounter[i] += 1
                        }
                    }
                }
            } else if (event.detail === 2) {

                thisArchiveGeneralSectionToggleCounter[index] = 0

                if (archiveGeneralNoteDeleteHelper === 0) {
                    for (let i = 0; i < theArchiveGeneralNoteIDs.length; i++) {
                        if (theArchiveGeneralNoteSectionValues[i] === sectionValue) {
                            numArchiveGeneralItems += 1
                        }
                    }
                    archiveGeneralNoteDeleteHelper = 1
                }

                while (numArchiveGeneralItems > 0) {
                    for (let i = theArchiveGeneralNoteIDs.length - 1; i >= 0; i--) {
                        if (theArchiveGeneralNoteSectionValues[i] === sectionValue) {
                            let movingNoteID = theArchiveGeneralNoteIDs[i]
                            let currentBtn = document.getElementById(`${movingNoteID}`)
                            currentBtn.click()
                            numArchiveGeneralItems -= 1
                        }
                    }
                }

                numArchiveGeneralItems = 0 
                archiveGeneralNoteDeleteHelper = 0 
            } 
        }
    }

    newEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(noteValue)
            newEl.innerHTML = `<p style="white-space: pre-line">(Copied ✔️) ${noteValue}</p>`
            setTimeout(function() {
                newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            let exactLocationOfNoteInDB = ref(database, `archivedGeneralNoteList/${noteID}`)
            remove(exactLocationOfNoteInDB)

            let thisLength = thisArchiveGeneralSectionToggleCounter.length - 1
            thisArchiveGeneralSectionToggleCounter.splice(thisLength, 1)


            let exactLocationOfSectionInDB = ref(database, `archivedGeneralNoteSectionList/${sectionID}`)
            remove(exactLocationOfSectionInDB)

            let thisSecondLength = thisArchiveGeneralSectionToggleCounter.length - 1
            thisArchiveGeneralSectionToggleCounter.splice(thisSecondLength, 1)


            for (let x = theArchiveGeneralNoteIDs.length - 1; x >= 0; x--) {
                if (theArchiveGeneralNoteIDs[x] === noteID) {
                    theArchiveGeneralNoteIDs.splice(x, 1)
                    theArchiveGeneralNoteValues.splice(x, 1)
                    theArchiveGeneralNoteSectionIDs.splice(x, 1)
                    theArchiveGeneralNoteSectionValues.splice(x, 1)
                }
            }


            for (let k = renderedArchiveGeneralSections.length - 1; k >= 0; k--) {
                if (renderedArchiveGeneralSections[k] === sectionValue) {
                    let sectionTotalOccurences = 0
                    for (let j = theArchiveGeneralNoteSectionValues.length - 1; j >= 0; j--) {
                        if (theArchiveGeneralNoteSectionValues[j] === sectionValue) {
                            sectionTotalOccurences += 1
                        }
                    }

                    if (sectionTotalOccurences === 0) {
                        thisArchiveGeneralSectionToggleCounter.splice(k, 1)
                    }
                }
            }
        }
    }

    deleteBtn.addEventListener("click", function() {
        let theGeneralNoteSectionFromDropdown = generalNoteSectionDropdown.options[generalNoteSectionDropdown.selectedIndex].text
        clearDropdown(generalNoteSectionDropdown)
        
        push(generalNotesListInDB, noteValue)
        push(generalNoteSectionsListInDB, sectionValue)
        


        let exactLocationOfNoteInDB = ref(database, `archivedGeneralNoteList/${noteID}`)
        remove(exactLocationOfNoteInDB)

        let thisLength = thisArchiveGeneralSectionToggleCounter.length - 1
        thisArchiveGeneralSectionToggleCounter.splice(thisLength, 1)


        let exactLocationOfSectionInDB = ref(database, `archivedGeneralNoteSectionList/${sectionID}`)
        remove(exactLocationOfSectionInDB)

        let thisSecondLength = thisArchiveGeneralSectionToggleCounter.length - 1
        thisArchiveGeneralSectionToggleCounter.splice(thisSecondLength, 1)



        let length = generalNoteSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (generalNoteSectionDropdown.options[i].textContent === theGeneralNoteSectionFromDropdown) {
                generalNoteSectionDropdown.selectedIndex = i
            }
        }

        for (let x = theArchiveGeneralNoteIDs.length - 1; x >= 0; x--) {
            if (theArchiveGeneralNoteIDs[x] === noteID) {
                theArchiveGeneralNoteIDs.splice(x, 1)
                theArchiveGeneralNoteValues.splice(x, 1)
                theArchiveGeneralNoteSectionIDs.splice(x, 1)
                theArchiveGeneralNoteSectionValues.splice(x, 1)
            }
        }


        for (let k = renderedArchiveGeneralSections.length - 1; k >= 0; k--) {
            if (renderedArchiveGeneralSections[k] === sectionValue) {
                let sectionTotalOccurences = 0
                for (let j = theArchiveGeneralNoteSectionValues.length - 1; j >= 0; j--) {
                    if (theArchiveGeneralNoteSectionValues[j] === sectionValue) {
                        sectionTotalOccurences += 1
                    }
                }

                if (sectionTotalOccurences === 0) {
                    thisArchiveGeneralSectionToggleCounter.splice(k, 1)
                }
            }
        }
    })
}



























// ARCHIVED TEMPLATE SECTION


let archivedTemplateList = document.getElementById("archived-template-list")
let archivedTemplateSectionList = document.getElementById("archived-template-section-list-wrapper")
const archivedTemplateListInDB = ref(database, "archivedTemplateList")
const archivedTemplateSectionListInDB = ref(database, "archivedTemplateSectionList")

onValue(archivedTemplateListInDB, function(snapshotArchiveNote) {
    onValue(archivedTemplateSectionListInDB, function(snapshotArchiveNoteSection) {
        if (snapshotArchiveNote.exists()) {
            let notesArray = Object.entries(snapshotArchiveNote.val())
            let noteSectionsArray = Object.entries(snapshotArchiveNoteSection.val())


            archivedTemplateList.innerHTML = ""
            archivedTemplateSectionList.innerHTML = ""
            renderedArchiveTemplateSections = []
            renderedArchiveTemplateSectionsIDs = []

            theArchiveTemplateIDs = []
            theArchiveTemplateValues = []
            theArchiveTemplateSectionIDs = []
            theArchiveTemplateSectionValues = []

            for (let i = 0; i < notesArray.length; i++) {
                let x = notesArray.length - 1 - i
                let noteItem = notesArray[x]
                let sectionItem = noteSectionsArray[x]

                renderArchiveTemplates(noteItem, sectionItem)
            }
        } else {
            archivedTemplateSectionList.innerHTML = ""
            archivedTemplateList.innerHTML = "No archived templates here..."
        }
    })
})


let renderedArchiveTemplateSections = []
let renderedArchiveTemplateSectionsIDs = []
let thisArchiveTemplateSectionToggleCounter = []

let numArchiveTemplateItems = 0
let archiveTemplateDeleteHelper = 0 

let theArchiveTemplateIDs = []
let theArchiveTemplateValues = []
let theArchiveTemplateSectionIDs = []
let theArchiveTemplateSectionValues = []

function renderArchiveTemplates(noteStored, sectionStored) {
    let noteID = noteStored[0]
    let noteValue = noteStored[1]

    let sectionID = sectionStored[0]
    let sectionValue = sectionStored[1]

    theArchiveTemplateIDs.push(noteID)
    theArchiveTemplateValues.push(noteValue)
    theArchiveTemplateSectionIDs.push(sectionID)
    theArchiveTemplateSectionValues.push(sectionValue)


    let newEl = document.createElement("li")
    newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`

    let deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `<button id='${noteID}' class='disappear'></button>`
    btnList.append(deleteBtn)

    if (sectionValue === "**Not Selected**") {
        archivedTemplateList.append(newEl)
    } else if (renderedArchiveTemplateSections.includes(sectionValue)) {
        for (let i = 0; i < renderedArchiveTemplateSections.length; i++) {
            if (renderedArchiveTemplateSections[i] === sectionValue) {
                let thisSection = document.getElementById(`${renderedArchiveTemplateSectionsIDs[i]}`)
                thisSection.append(newEl)
            }
        }

    } else {
        let theSectionList = document.createElement("ul")
        theSectionList.id = `${sectionID}`
        theSectionList.className = "disappear"

        let sectionHeader = document.createElement("li")
        sectionHeader.innerHTML = `<h3 id='${sectionID}-title' class="heading">${sectionValue}</h3>`
        archivedTemplateSectionList.append(sectionHeader)

        theSectionList.append(newEl)
        archivedTemplateSectionList.append(theSectionList)

        renderedArchiveTemplateSections.push(sectionValue)
        renderedArchiveTemplateSectionsIDs.push(sectionID)
        thisArchiveTemplateSectionToggleCounter.push(0)
        let index = renderedArchiveTemplateSections.length - 1


        if (thisArchiveTemplateSectionToggleCounter[index] % 2 != 0) {
            theSectionList.className = "sectionList"
        }

        sectionHeader.onclick = event => {
            if (event.detail === 1) {
                for (let i = 0; i < renderedArchiveTemplateSections.length; i++) {
                    if (renderedArchiveTemplateSections[i] === sectionValue) {
                        if (thisArchiveTemplateSectionToggleCounter[i] % 2 === 0) {
                            theSectionList.className = "sectionList"
                            thisArchiveTemplateSectionToggleCounter[i] += 1
                        } else {
                            theSectionList.className = "disappear"
                            thisArchiveTemplateSectionToggleCounter[i] += 1
                        }
                    }
                }
            } else if (event.detail === 2) {

                thisArchiveTemplateSectionToggleCounter[index] = 0

                if (archiveTemplateDeleteHelper === 0) {
                    for (let i = 0; i < theArchiveTemplateIDs.length; i++) {
                        if (theArchiveTemplateSectionValues[i] === sectionValue) {
                            numArchiveTemplateItems += 1
                        }
                    }
                    archiveTemplateDeleteHelper = 1
                }

                while (numArchiveTemplateItems > 0) {
                    for (let i = theArchiveTemplateIDs.length - 1; i >= 0; i--) {
                        if (theArchiveTemplateSectionValues[i] === sectionValue) {
                            let movingNoteID = theArchiveTemplateIDs[i]
                            let currentBtn = document.getElementById(`${movingNoteID}`)
                            currentBtn.click()
                            numArchiveTemplateItems -= 1
                        }
                    }
                }

                numArchiveTemplateItems = 0 
                archiveTemplateDeleteHelper = 0 
            } 
        }
    }

    newEl.onclick = event => {
        if (event.detail === 1) {
            navigator.clipboard.writeText(noteValue)
            newEl.innerHTML = `<p style="white-space: pre-line">(Copied ✔️) ${noteValue}</p>`
            setTimeout(function() {
                newEl.innerHTML = `<p style="white-space: pre-line">${noteValue}</p>`
            }, 500)
        } else if (event.detail === 2) {
            let exactLocationOfNoteInDB = ref(database, `archivedTemplateList/${noteID}`)
            remove(exactLocationOfNoteInDB)

            let thisLength = thisArchiveTemplateSectionToggleCounter.length - 1
            thisArchiveTemplateSectionToggleCounter.splice(thisLength, 1)


            let exactLocationOfSectionInDB = ref(database, `archivedTemplateSectionList/${sectionID}`)
            remove(exactLocationOfSectionInDB)

            let thisSecondLength = thisArchiveTemplateSectionToggleCounter.length - 1
            thisArchiveTemplateSectionToggleCounter.splice(thisSecondLength, 1)


            for (let x = theArchiveTemplateIDs.length - 1; x >= 0; x--) {
                if (theArchiveTemplateIDs[x] === noteID) {
                    theArchiveTemplateIDs.splice(x, 1)
                    theArchiveTemplateValues.splice(x, 1)
                    theArchiveTemplateSectionIDs.splice(x, 1)
                    theArchiveTemplateSectionValues.splice(x, 1)
                }
            }


            for (let k = renderedArchiveTemplateSections.length - 1; k >= 0; k--) {
                if (renderedArchiveTemplateSections[k] === sectionValue) {
                    let sectionTotalOccurences = 0
                    for (let j = theArchiveTemplateSectionValues.length - 1; j >= 0; j--) {
                        if (theArchiveTemplateSectionValues[j] === sectionValue) {
                            sectionTotalOccurences += 1
                        }
                    }

                    if (sectionTotalOccurences === 0) {
                        thisArchiveTemplateSectionToggleCounter.splice(k, 1)
                    }
                }
            }
        }
    }

    deleteBtn.addEventListener("click", function() {
        let theTemplateSectionFromDropdown = templateSectionDropdown.options[templateSectionDropdown.selectedIndex].text
        clearDropdown(templateSectionDropdown)
        
        push(templateListInDB, noteValue)
        push(templateSectionsListInDB, sectionValue)
        


        let exactLocationOfNoteInDB = ref(database, `archivedTemplateList/${noteID}`)
        remove(exactLocationOfNoteInDB)

        let thisLength = thisArchiveTemplateSectionToggleCounter.length - 1
        thisArchiveTemplateSectionToggleCounter.splice(thisLength, 1)


        let exactLocationOfSectionInDB = ref(database, `archivedTemplateSectionList/${sectionID}`)
        remove(exactLocationOfSectionInDB)

        let thisSecondLength = thisArchiveTemplateSectionToggleCounter.length - 1
        thisArchiveTemplateSectionToggleCounter.splice(thisSecondLength, 1)



        let length = templateSectionDropdown.options.length - 1;
        for (let i = length; i >= 0; i--) {
            if (templateSectionDropdown.options[i].textContent === theTemplateSectionFromDropdown) {
                templateSectionDropdown.selectedIndex = i
            }
        }

        for (let x = theArchiveTemplateIDs.length - 1; x >= 0; x--) {
            if (theArchiveTemplateIDs[x] === noteID) {
                theArchiveTemplateIDs.splice(x, 1)
                theArchiveTemplateValues.splice(x, 1)
                theArchiveTemplateSectionIDs.splice(x, 1)
                theArchiveTemplateSectionValues.splice(x, 1)
            }
        }


        for (let k = renderedArchiveTemplateSections.length - 1; k >= 0; k--) {
            if (renderedArchiveTemplateSections[k] === sectionValue) {
                let sectionTotalOccurences = 0
                for (let j = theArchiveTemplateSectionValues.length - 1; j >= 0; j--) {
                    if (theArchiveTemplateSectionValues[j] === sectionValue) {
                        sectionTotalOccurences += 1
                    }
                }

                if (sectionTotalOccurences === 0) {
                    thisArchiveTemplateSectionToggleCounter.splice(k, 1)
                }
            }
        }
    })
}

















// Info Section 

let infoImg = document.querySelector("#info-img")
let subMainSection = document.querySelector("#sub-main-wrapper")
let infoSection = document.querySelector("#info-section")
let infoSectionToggle = 0 

infoImg.addEventListener("click", function() {
    if (infoSectionToggle % 2 === 0) {
        subMainSection.className = "disappear"
        infoSection.className = ""
        infoSectionToggle += 1
    } else {
        subMainSection.className = ""
        infoSection.className = "disappear"
        infoSectionToggle += 1
    }
})

