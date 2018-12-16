$(document).ready(function () {
 //header sizing 
 var fraction = 1/2;
 $('header').css('height', 618 * fraction + 'px');
 $('header').css('width', 1680 * fraction + 'px'); 
 //fighters
 var objFighters = {
     fighters: ['Paul', 'Gurney', 'Baron', 'Feyd'],
    hp: [120,100,150,180],
    attack: [8,5,15,25]
    };
var fighters;
var character;
	// Battle variables
	var opponent;
	var characterName;
	var opponentName;
	var characterAttack;
	var characterHP;
	var characterHPTotal;
	var opponentAttack;
	var opponentHP;
	var opponentHPTotal;
	var characterPercentage;
	var opponentPercentage;
	var characterHPText;
	var opponentHPText;
    var battleTimes;
    
   //after screen loads start game
   start();
   
   //this function allows restart
   function start() {
       //initialize variables
       battleTimes=0;
       //set bg img, hide buttons.
       $('body').css({
           'background': 'url(assets/images/background.jpg',
           'background-position': 'center bottom',
           '-webkit-background-size': 'cover',
           '-moz-background-size': 'cover',
           'background-size': 'cover',
		  '-o-background-size': 'cover'
       });
       $('body .winner').remove();
       $('body button').remove();
       //remove unused characters
       $('battlefield').remove();
       //establish characters
       var div= $('<div>');
       div.addClass('characters')
       $('.position-characters').append(div);
       //loop for each fighter
       for (var i=0; i<objFighters.fighters.length; i++) {
           //create holder for each fighter
           var fighterHolder = $('<div>');
           //add fighter class
           fighterHolder.addClass('characters-fighters');
           fighterHolder.attr('type',objFighters.fighters[i]);
           fighterHolder.attr('hp',objFighters.attack[i]);
           fighterHolder.append('<img src="assets/images/'+ objFighters.fighters[i] + '.png"/>');
           //create level
           var level = $('<h6>');
           level.text('Lv30');
           fighterHolder.append(level);
           //create hp bar and text
           var hp = $('<h6>');
           hp.text('HP');
        //create color bar helper. 
           var colorHelper = $('<div>');
           colorHelper.addClass('hp-bar-color-helper');
    //create HP bar
    var hpBar = $('<div>');
    hpBar.addClass('hp-bar');
    //create color bar
    var color = $('<div>');
    color.addClass('hp-bar-color');
    //append hp and color bck to hp bar
    hpBar.append(colorHelper);
    hpBar.append(hp);
    hpBar.append(color);
    //append hp bar to fighter holder
    fighterHolder.append(hpBar);
    //create number hp
    var numberHP = $('<h6>');
    numberHP.text(objFighters.hp[i] + ' / ' + objFighters.hp[i]);
    fighterHolder.append(numberHP);
    //appand fighter holder
    $('.characters').append(fighterHolder);
   }
//show message
    var h1 = $('<h1>');
    h1.text('Choose Your Character');
    $('.characters').append(h1);
}

//when character is clicked
$('.position-characters').on('click', '.characters-fighters', function() {
//remove choose your characters
$('.characters h1').remove();
//make position class for character selection
var selected = $('<div>');
selected.addClass('selected-character');
//make positioning class for other characters
var unselected = $('<div>');
unselected.addClass('unselected-characters');
// add dive to position characters
$('.position-characters').append(selected);
$('.position-characters').append(unselected);
//remove characters-fighters class
$('.characters').children().removeClass('characters-fighters');
//add seleced fighters to selected
character = $(this);
selected.append(character);
// Flip selected Feyd or Gurney
if (character.attr('type') == 'Feyd' || character.attr('type') == 'Gurney') {
    character.children("img").addClass('flipped');
}
//add others to unselected
var otherFighters = $(".characters").children();
unselected.append(otherFighters);
//remove original fighter holder
$('.position-characters .characters').remove();
//add proper sizing
selected.children().addClass('selected-character-fighters');
unselected.children().addClass('unselected-character-fighters');
// Flip unselected fighters if Feyd or Gurney
$('.unselected-character-fighters').each(function() {
    var fighters = $(this);
    if (fighters.attr('type') == 'Paul' || fighters.attr('type') == 'Feyd') {
        fighters.children("img").addClass('flipped');
    }
});
//show your character   
selected.append('<h1>Your Fighter</h1>');
selected.last
//show your 'choose opponent
unselected.append('<h1>Choose your Opponent</h1>');
});

//when unselected character is clicked
$('.position-characters').on('click', '.unselected-character-fighters', function() {
    //remove 'your character'
    $('.selected-character h1').remove();
//remove choose opponent THIS IS PLURAL NOW????
$('.unselected-characters h1').remove();
//make position class for sidelined characters
var sidelines = $('<div>');
sidelines.addClass('sidelines');
//make positioing class for battlefield
var battlefield = $('<div>');
battlefield.addClass('battlefield');
//remove selected and unselected character classes
$('.position-characters').append(sidelines);
$('.position-characters').append(battlefield);
//removeClass selected and unselected character classes
$('.selected-character').children().removeClass('selected-character-fighters');
$('.unselected-characters').children().removeClass('unselected-character-fighters');
//add selected character and selected enemy to Bfield
character = $(".selected-character").children();
opponent = $(this);
battlefield.append(character);
battlefield.append(opponent);
//add others to sidelines
var otherFighters = $(".unselected-characters").children();
sidelines.append(otherFighters);
//remove original selected and unselected holders
$('.position-characters .selected-character').remove();
$('.position-characters .unselected-characters').remove();
//add proper sizing
battlefield.children().addClass('battle-fighters');
sidelines.children().addClass('sideline-fighters');
//show 'click enemy to attach'
var h2 = $('<h2>');
h2.text('click enemy to attack');
battlefield.append(h2);
//start battle
battle();
});

var count = 0;
function battle() {
    //turn off sideline fighter click
    $('.position-characters').off('click', '.sideline-fighters');
    //initialize variables - EQ means equals??
    if (battleTimes == 0) {
       characterHPTotal = $('.battle-fighters:eq(0)').attr('hp');
        characterHP = characterHPTotal;
        characterAttack = Number($('.battle-fighters:eq(0)').attr('attack'));
        originalCharacterAttack = characterAttack;
    }
    //reinitialize count
    count=0;
    //enter click battle
    clickBattle();
    battleTimes++;
}
//function for clicking fighters to battle
function clickBattle(){
    $('.position-characters').on('click', '.battle-fighters:eq(1)', function() {
        //stop click so animation can happen before player clicks again
        $('.position-characters').off('click', '.battle-fighters;eq(1)');
        //remove 'click enemey to attack' or 'fighter defeated'
        $('.battlefield h2').remove();
        $('.battlefield h3').remove();
        if (count ==0) {
            characterName =$('.battle-fighters:eq(0)').attr('type');
            opponentName = $('.battle-fighters:eq(1)').attr('type');
            opponentAttack = $('.battle-fighters:eq(1)').attr('attack');
           opponentHPTotal = ('battle-fighters:eq(1)').attr('hp');
            opponentHP = opponentHPTotal;
            characterHPText = $('.battle-fighters:eq(0)').children('h6:eq(1)');
            opponentHPText = $('.battle-fighters:eq(1)').children('h6:eq(1)');
        }
      //create attack message
      var yourAttackMessage = $('<h3>');
      var opponentAttackMessage = $('<h3>');
      //append empty tags
      $('.battlefield').append(yourAttackMessage);
      $('.battlefield').append(opponentAttackMessage);
      //animation logic to sho when character is alive
      if (characterHP !=0) {
         //calculate character damage on opponent
         opponentHP -= characterAttack;
         //calculate percentage
         opponentPercentage = 86 * opponentHP/opponentHPTotal; 
     //see if opponentHP reaches 0
     if (opponentHP <=0) {
         $('.position-characters').off('click', '.battle-fighters:eq(1)');
         opponentHP = 0;
         opponentPercentage = 0;
         //move battlefield backwards so player can click on sideline fighters
         $('.battlefield').css('z-index', '-1');
         //delay defeated steps
         window.setTimeout(function() {
             defeated('opponent',1,0,1); 
            }, 500);
     }
     //show css animation if character is not dead
     $('.battle-fighters:eq(0)').addClass('animation-character');
     $('.battle-fighters:eq(0)').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
         $('.battle-fighters:eq(0)').removeClass('animation-character');
         //update hp bar
         $('.battle0fighters:eq(1) .hp-bar-color').css('width', string(opponentPercentage) + '%');
         // change color to yellow if less than equal to 50%
         //and red if less than or equal to 20 percent
         if(opponentPercentage <= 20) {
             $('.battle-fighters:eq(1) .hp-bar-color').css('background', 'red');
         } else if (opponentPercentage<= 50) {
             $('.battle-fighters:eq(1) .hp-bar-color').css('background', 'yellow');
              }
           //update text
        opponentHPText.text(opponentHP + ' / ' + opponentHPTotal);
        //show attack message
        yourAttackMessage.html('you attacked ' + opponentName + ' for <span style="color:red">' + characterAttack + '</span> damage.');   
    //check if either player or enemy died
    if(opponentHP != 0) {
        //calculate enemy damage on character
        characterHP -= opponentAttack;
        //calculate percentage
        characterPercentage = 86 * characterHP/characterHPTotal;
        //see if character HP reaches 0
        if(characterHP <=0) {
            $('.position-characters').off('click', '.battle-fighters:eq(1)');
            characterHP= 0;
            characterPercentage = 0;
            //delay defeated steps
            window.setTimeout(function() {
                defeated('character',0,2,3); 
            }, 500);
        }
    //show css animation enemy not dead
    $('.battle-fighters:eq(1)').addClass('animation-opponent');
    $('.battle-fighters:eq(1)').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
        $('.battle-fighters:eq(1)').removeClass('.animation-opponent');
        //update hp bar
        $('.battle-fighters:eq(0) .hp-bar-color').css('width', String(characterPercentage) + '%');
        //change color to yellow if less than or equal to 50%
        //and red if less than 20 percent
        if (characterPercentage <=20) {
            $('.battle-fighters:eq(0) .hp-bar-color').css('background', 'red');
            } else if (characterPercentage<= 50) {
                $('.battle-fighters:eq(0) .hp-bar-color').css('background', 'yellow');
            }
            // Update text
            characterHPText.text(characterHP + ' / ' + characterHPTotal);
            // Show attack message
            opponentAttackMessage.html(opponentName + ' attacked you for <span style="color:red">' + opponentAttack + '</span> damage.');
            // Renew click if neither player is dead
                clickBattle()
            });
         }  
     });
     }
     //update character damage and count for next round
     characterAttack += originalCharacterAttack;
     count++;
    });
    }
//function for defeated after if statements
function defeated(person,num,first,second) {
    var show;
    var rotater;
    var h2 = $('<h2>');
    //turn click handler off
    $('.position-characters').off('click', '.battle-fighters:eq(' + num + ')');
    if (person == 'character') {
        //player is defeated
        show =characterName;
        rotater = 'character';
        //show defeated
        h2.css('color','yellow');
        h2.text('you have been defeated!');
      //red battlefield
      $('body').css({
          '.background': 'linear-gradient(rgba(255, 0, 0, 0.45), rgba(255,0, 0, 0.45)),url(assets/images/background.png)',
          '.background-position' : 'center bottom',
          '-webkit-background-size': 'cover',
			  '-moz-background-size': 'cover',
			  'background-size': 'cover',
			  '-o-background-size': 'cover'
      });
      $('.battle-fighters:eq(1)').css('opacity','0.4');
      //show 'you lose'
      var loser = $('<h1>');
      loser.addClass('winner');
      loser.text('Sorry! You lost!');
      $('header').append(loser);
      //restart
      restart();
    } else {
        //enemy is defeated
        show = opponentName;
        h2.css('color','yellow')
        h2.text(show + ' has been defeated');
        //show 'choose next opponent'
        var h3 = $('<h3>');
        h3.text('choose your next opponent');
        $('.sidelines').append(h3);
        //clicking sideline fighters to choose new opponent
        $('.position-charaters').on('click', '.sideline-fighters', function() {
            //remove all h2 and (h3) from battlefield and sidelines
            $('.battlefield h2').remove();
            $('.battlefield h3').remove();
            $('.sidelines h3').remove();
            //remove defeated fighters
            $('.battle-fighters:eq(1)').remove();
            //change fighters from sideline to battle fighters
            $(this).addClass('battle-fighters');
            $(this).removeClass('sideline-fighters');
            //move fighters to battlefield
            $('.battlefield').append($(this));
            //float right sideline fighters
            $('.sideline-fighters').css('float','right');
            //move battlefield forwards so person can click on battlefield fighters
            $('.battlefield').css('z-index','1');
            //restart battle if more fighters
            battle();
        });
    }
   //show 'had been defeated'
   $('.battlefield').append(h2);
   //show fainted fighter
   $('.battle-fighters:eq(' + num + ')').children('img').attr('src','assets/images/fainted' + show + '.png');
   //rotate faitned fighter
   if (show == objFighters.fighters[first] || show == objFighters.fighters[second]) {
       $('.battle-fighters:eq(' + num + ')').children("img").addClass('rotated-flipped-' + person);     
   } else {
       $('.battle-fighters:eq(' + num + ')').children("img").addClass('rotated-' + person);
   }
  //end game if all fighters are defeated
  if(battleTimes ==3) {
      //remove sidelines because there are no more fighters
      $('.sidelines').remove();
      //white battlefield
      $('body').css({
        'background': 'linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)),url(assets/images/background.png)',
        'background-position': 'center bottom',
      '-webkit-background-size': 'cover',
      '-moz-background-size': 'cover',
      'background-size': 'cover',
      '-o-background-size': 'cover'    
      });
      $('.battle-fighters:eq(1)').css('opacity','0.4');
      //show you win
      var winner = $('<h1>');
      winner.addClass('winner');
      winner.text('Congratulations! You win!');
      $('header').append(winner);
      //restart
    restart();
  } 
}
    function restart() {
     //show restart button
     var restart = $('<button>');
     restart.addClass('restart');
     restart.text('RESTART');
     $('header').append(restart);
     //when restart button is pressed
     $('header').on('click', '.restart', function() {
         $('header').on('click', '.restart');
         $('.position-characters .sidelines').remove();
         start();
		});
	}
});         