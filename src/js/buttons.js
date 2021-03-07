clearAllHandler();

function clearAllHandler() {

    clearAll.addEventListener('click', function() {
             {
                count = 0;
                allMemberBoxes.forEach(element => {
                    if(element.hasChildNodes()) element.removeChild(element.firstChild);
                });

                while(chosenBox.hasChildNodes()) {
                    chosenBox.firstChild.className = 'traineeBox';
                    chosenBox.firstChild.setAttribute('chosen', 'false');
                    selectorInnerBox.appendChild(chosenBox.firstChild);
                    sortAlphabetical(selectorInnerBox);
                }
                
        }
    });

    clearAll.addEventListener('mouseover', function() {
        this.src = './src/img/clear_hover.png';
    });

    clearAll.addEventListener('mouseout', function() {
        this.src = './src/img/clear_idle.png';
    });
}