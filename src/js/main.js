const numberOfMembers = 11;
// desktop ver

createDesktopBoxes();

function createDesktopBoxes() {
    const tvScreen = document.querySelector('#tvScreen');
    let placeholderContainer = document.createDocumentFragment();
    
    for (let _trainee = 1 ; _trainee <= numberOfMembers; _trainee++) {
        let tempMember = document.createElement('div');
        tempMember.id = 'mem' + _trainee;
        placeholderContainer.appendChild(tempMember);
    }
    tvScreen.appendChild(placeholderContainer);
}
