const contestantsCSV = 'contestants'; // csv where trainee info is stored
const portraitFolder ='./src/img/portraits/'; // folder where trainee pictures are located
const portraitFormat = '.png'; // format of portrait image

// locations to pull and save assets
const screenshotFileName = 'chuang-2021-party.png';
const saveButtonHover = './src/img/save_hover.png';
const saveButtonIdle = './src/img/save_idle.png';

const selectorBox = document.getElementById('selector');
const selectorInnerBox = document.getElementById('selectorBox');

// save screenshot and current choices
const saveButton = document.getElementById('saveButton');
const saveLink = document.getElementById('saveLink');

const searchBox = document.querySelector('#searchBox');
const nameFilter = document.querySelector('#nameFilter');
const companyFilter = document.querySelector('#companyFilter');

const allTraineeBoxes = document.getElementsByClassName('traineeBox');
const allMemberBoxes = document.querySelectorAll("div[id^='mem']");
const chosenBox = document.querySelector('#chosenBox');

let count = 0; // current number of trainees on the board
let availableCount = nextAvailableNumber(); // free space on the board

saveButtonHandler();
searchBoxHandler();
clickImageHandler();

function saveButtonHandler() {
saveButton.addEventListener('click', function() {
    saveLink.download = screenshotFileName;
});

saveButton.addEventListener('mouseover', function() {
    saveButton.src = saveButtonHover;

    window.scroll(0,0);

    // create a 'screenshot' of the TV box using html2canvas
    html2canvas(document.getElementById('tvBox')).then(function(canvas) {
        var img = canvas.toDataURL('./image/png').replace("image/png", "image/octet-stream");
        saveLink.setAttribute('href', img);
    });
});

saveButton.addEventListener('mouseleave', function() {
    saveButton.src = saveButtonIdle;
});

}

// get csv contents and populate lists
function preload() {
    contestants = loadTable(contestantsCSV, 'csv', 'header');
}

function setup() {
    let traineeList = document.createDocumentFragment();
    
    for (let i = 0; i < contestants.getRowCount(); i++) {
        let traineeBox = document.createElement('div');
        
        let traineeName = document.createElement('span');
        let traineeFirst = document.createElement('span');
        let traineeHanzi = document.createElement('span');
        let traineeCompany = document.createElement('span');

        let portraitBox = document.createElement('div');
        let portraitImg = document.createElement('img');
        
        traineeBox.className = 'traineeBox';
        portraitBox.className = 'portrait';
        traineeName.className = 'name';
        traineeFirst.className = 'eng';
        traineeHanzi.className = 'hanzi';
        traineeCompany.className = 'company';

        traineeName.appendChild(traineeFirst);
        traineeName.appendChild(traineeHanzi);

        portraitBox.appendChild(portraitImg);
        traineeBox.appendChild(portraitBox);
        traineeBox.appendChild(traineeName);
        traineeBox.appendChild(traineeCompany);
        
        traineeBox.addEventListener('mouseover', function() {
            traineeBox.style.backgroundColor = '#7B67FE';
            traineeBox.style.boxShadow = 'inset 0.5em 0.5em lavender';
        });

        traineeBox.addEventListener('mouseleave', function() {
            traineeBox.style.backgroundColor = '#673ffc';
            traineeBox.style.boxShadow = 'inset 0.5em 0.5em #7B67FE';
        });
    
        portraitImg.src = portraitFolder + contestants.getString(i, 0) + portraitFormat + '';

        traineeFirst.innerText = contestants.getString(i, 0).trim();
        traineeHanzi.innerText = " (" + contestants.getString(i, 1).trim() + ")";
        traineeCompany.innerText = contestants.getString(i, 2);

        traineeBox.setAttribute('chosen', false);
        traineeList.appendChild(traineeBox);
    }
    selectorInnerBox.appendChild(traineeList);

    for (let i = 0; i < allTraineeBoxes.length; i++) {

        allTraineeBoxes[i].addEventListener('click', function() {
            availableCount = nextAvailableNumber();
            let selectionBox = document.querySelector('#selectorBox');
            if (this.getAttribute('chosen') == 'false') {
                if (count < 11) {
                    this.setAttribute('chosen', 'true');
                    this.className = this.className + ' chosen';
                    let memBoxes = document.querySelectorAll("[id^='mem']");
                    chosenBox.appendChild(this);
                    
                    sortAlphabetical(chosenBox);

                    for (let j = 0 ; j < memBoxes.length; j++) {
                        if(memBoxes[j].querySelector('img') == null) {
                            let tempDiv = document.createElement('div');
                            let tempImg = document.createElement('img');
                            let tempFragment = document.createDocumentFragment();
                            let tempName = this.querySelector('.eng').innerText;
                            let namePlate = createNamePlate(tempName);
                            
                            tempImg.id = 'img' + availableCount;
                            tempDiv.id = 'wrapper' + availableCount;
                            tempImg.src = portraitFolder + '/cropped/' + tempName + portraitFormat + '?' + Math.floor(Math.random() * 100);
                            count++;

                            tempImg.addEventListener('dragstart', e => pick(e));
                            memBoxes[j].addEventListener('drop', e => swap(e));
                            memBoxes[j].addEventListener('dragover', e => initiate(e));

                            tempFragment.appendChild(tempImg);
                            tempFragment.appendChild(namePlate);
                            tempDiv.appendChild(tempFragment);
                            memBoxes[j].appendChild(tempDiv);
                            break;
                        }
                    }
                }
            }
            
            else {
                this.className = 'traineeBox';
                this.setAttribute('chosen', 'false');
                selectionBox.appendChild(this);
                sortAlphabetical(selectionBox);
                removeMember(this.querySelector('.eng').innerText);
            }
        });
    }
    
}

function nextAvailableNumber() {
    const allWrappers = document.querySelectorAll("div[id^='wrapper']");
    let availableNumber = 0;

    let sortedWrappers = [...allWrappers].sort(function(a, b) {
        if(a.id.toString().substr(6) > b.id.toString().substr(6))
            return 1;
        if(a.id.toString().substr(6) < b.id.toString().substr(6))
            return -1;
        return 0;
    });

    sortedWrappers.forEach(element => {
            if (element.id == ('wrapper' + availableNumber))
                availableNumber++;
    });

    return availableNumber;
}

// search box
function searchBoxHandler() {
    let searchQuery;

    nameFilter.addEventListener('click', function() {
        searchContestants(searchQuery);
    });

    companyFilter.addEventListener('click', function() {
        searchContestants(searchQuery);
    });

    searchBox.addEventListener('keyup', function() {
        searchQuery = searchBox.value.toLowerCase();
        searchContestants(searchQuery);
    });
}

// search current list of contestants
function searchContestants(searchQuery) {
    let contestantsToSearch, elementToSearch;
    let searchFilter, searchName, searchCompany; 
    
    contestantsToSearch = allTraineeBoxes;
    
    searchName = nameFilter.checked;
    searchCompany = companyFilter.checked;
    searchQuery = searchBox.value.toLowerCase();
    
    switch (true) {
        case searchName: searchFilter = 'name'; break;
        case searchCompany: searchFilter = 'company'; break;
        default: break;
    }

    [...contestantsToSearch].filter(query => {
        switch(searchFilter) {
            case ('name'): elementToSearch = query.querySelector('.name'); break;
            case ('company'): elementToSearch = query.querySelector('.company'); break;
            default: elementToSearch = query; break;
        }

        if (elementToSearch.innerText.toLowerCase().includes(searchQuery))
            query.style.display = 'grid';
        else
            query.style.display = 'none';
    });

    // drap and drop
}

function swap(event) {
    event.preventDefault();
    let currentImage = document.getElementById(event.dataTransfer.getData("src")).parentElement;
    let imageFrame = currentImage.parentNode;
    let replaceImage = event.currentTarget.firstElementChild;
    event.currentTarget.replaceChild(currentImage, replaceImage);
    imageFrame.appendChild(replaceImage);
}

function initiate(event) {
    event.preventDefault();
}

function pick(event) {
    event.dataTransfer.setData("src", event.target.id);
}

function createNamePlate(name) {
    let namePlate = document.createElement('div');
    namePlate.className = 'active';
    namePlate.innerHTML = '<span>'+ name + '</span>';

    return namePlate;
}

function sortAlphabetical(div) {
    const allBoxesInDiv = div.getElementsByClassName('traineeBox');
    let sortedDivElements = document.createDocumentFragment();
    let sortedDiv = [...allBoxesInDiv].sort(function(a, b) {
        if (a.querySelector('.name').innerText > b.querySelector('.name').innerText)
            return 1;
        if (a.querySelector('.name').innerText < b.querySelector('.name').innerText)
            return -1;
        return 0;
    });

    div.innerHTML = '';
    sortedDiv.forEach(element => {
        sortedDivElements.appendChild(element);
    });
    div.appendChild(sortedDivElements);
}

function removeMember(member) {

    member = member.toLowerCase().trim();
    
    let boxToDelete = document.createElement('div');
    let wrapperBoxes = [...allMemberBoxes].filter(element => element.querySelector("div[id^='wrapper']"));

    count--;

    for (let i = 0; i < allMemberBoxes.length;i++) {
        if(allMemberBoxes[i].hasChildNodes()) {
            wrapperBoxes[i] = allMemberBoxes[i].querySelector("div[id^='wrapper']");
        }
    }
    

    wrapperBoxes.forEach(element => {
        if(element.innerHTML.toLowerCase().trim().includes(member)) {
            boxToDelete = element;
        }
    });

    let boxId = parseInt(boxToDelete.parentNode.id.substr(3));

    boxToDelete.parentNode.removeChild(document.getElementById(boxToDelete.id));
    
    for (let i = boxId - 1, j = i + 1; i < allMemberBoxes.length, j < allMemberBoxes.length;i++, j++) {
        let currentParent = document.getElementById(allMemberBoxes[i].id);
        let newParent = document.getElementById(allMemberBoxes[j].id);

        try {
            if(!currentParent.hasChildNodes()) {
                currentParent.appendChild(newParent.firstChild);
            }
        } catch(e) {
        }
    }

    availableCount = nextAvailableNumber();
}

function clickImageHandler() {
    const traineeList = document.querySelectorAll('.traineeBox');
    allMemberBoxes.forEach(element => {
        element.addEventListener('click', function(){
            
            let traineeName, traineeBoxToRemove, traineeBoxToAdd = document.createDocumentFragment();

            if (this.hasChildNodes())
                traineeName = this.querySelector("span").innerText.toLowerCase().trim();

                removeMember(traineeName);

                traineeBoxToRemove = Array.from(chosenBox.childNodes).find(element => element.querySelector('.name').textContent.toLowerCase().trim().includes(traineeName));
                traineeBoxToRemove.className = 'traineeBox';
                traineeBoxToRemove.setAttribute('chosen', 'false');
                traineeBoxToAdd.appendChild(traineeBoxToRemove);
                selectorInnerBox.prepend(traineeBoxToAdd);
                sortAlphabetical(selectorInnerBox);

        });
    });
}
    