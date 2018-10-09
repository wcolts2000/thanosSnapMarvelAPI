const charactersURL = "https://gateway.marvel.com/v1/public/events/29/characters?limit=100&apikey=d7fe12008a87b8c5133f9225e1c629d0";
const charactersElement = document.querySelector('.characters');
const audioElement = new Audio('intro.mp3');
const snapElement = document.querySelector('#snap');
const thanosElement = document.querySelector('#thanos');
const theTruth = document.querySelector('#theTruth');

audioElement.play();
snapElement.style.opacity = "0";
theTruth.style.opacity = "0";

function getCharacterData() {
  if (localStorage.characterData) {
    return Promise.resolve(JSON.parse(localStorage.characterData));
  }
  return fetch(charactersURL)
  .then(response => response.json())
  .then(data => {
   localStorage.characterData = JSON.stringify(data);
   return data;
 }); 
}

const charactersToOmit = {
  1009165: true,
  1009560: true,
  1009576: true,
  1009726: true,
  1009646: true,
  1009299: true,
  1009652: true
};

function addCharactesToPage(characterData) {
  console.log(characterData);
  
  characterData.data.results.forEach(result => {
    if(!charactersToOmit[result.id]){
    const characterImage = result.thumbnail.path + '/standard_medium.jpg'; 
    const characterElement = document.createElement('div');
    characterElement.style.transform = 'scale(1)';
    characterElement.className = 'character alive';

    const imageElement = document.createElement('img');
    imageElement.src = characterImage;
    characterElement.appendChild(imageElement);

    const characterName = result.name.replace(/\(.*\)/, '');
    const characterNameElement = document.createElement('h3');
    characterNameElement.textContent = characterName;
    characterElement.appendChild(characterNameElement);
    charactersElement.appendChild(characterElement);
  }
  });
}

getCharacterData()
  .then(addCharactesToPage);

  thanosElement.addEventListener('click', () => {
    snapElement.style.opacity = "1";

    setTimeout(() => {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.src = 'snap.mp3';
      audioElement.play();
      snapElement.style.opacity = "0";

      setTimeout(() => {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.src = 'funeral.mp3';
      audioElement.play();
      balanceTheUniverse();
      }, 3000)
    }, 3000)
  });


  function balanceTheUniverse() {
    const characters = [...document.querySelectorAll('.character')];
    let leftToDie = Math.floor(characters.length / 2);

    kill(characters, leftToDie);
  }

  function kill(characters, leftToDie) {
    if(leftToDie > 0) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const [characterChosen] = characters.splice(randomIndex, 1);

      characterChosen.style.transform = 'scale(0)';
      characterChosen.classList.remove('alive');
      characterChosen.classList.add('dead');
      
      setTimeout(() => {
        kill(characters, leftToDie - 1);
      }, 1000);
    } else {
      document.querySelectorAll('.dead').forEach(character => {
        character.style.display = 'none'; 
      });
      theTruth.style.opacity = '1';
    }
  }
