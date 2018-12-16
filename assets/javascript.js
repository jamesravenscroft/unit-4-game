

 $(document).ready(function () {
	// Header sizing
	var fraction = 1/2;
	$('header').css('height', 618 * fraction + 'px');
	$('header').css('width', 1680 * fraction + 'px');
	// dune
	var objdune = {
		dune: ['Paul','Feyd','Baron','Gurney'],
		hp: [120,100,150,180],
		attack: [8,5,15,25]
	};
	var dune;
	var character;
	// Battle variables
	var enemy;
	var characterName;
	var enemyName;
	var characterAttack;
	var characterHP;
	var characterHPTotal;
	var enemyAttack;
	var enemyHP;
	var enemyHPTotal;
	var characterPercentage;
	var enemyPercentage;
	var characterHPText;
	var enemyHPText;
	var battleTimes;

	// After screen loads start game
	start();

	// Function to allow for restart
	function start() {
		// Initialize variables
		battleTimes = 0;
		// Fix background and get rid of div and buttons
		$('body').css({
			'background': 'url(assets/images/background.png)',
			'background-position': 'center bottom',
		  '-webkit-background-size': 'cover',
		  '-moz-background-size': 'cover',
		  'background-size': 'cover',
		  '-o-background-size': 'cover'
		});
		$('body .winner').remove();
		$('body button').remove();
		// Remove position-characters
		$('.battlefield').remove();
		// Create characters
		var div = $('<div>');
		div.addClass('characters')
		$('.position-characters').append(div);
		// Loop for each dune
		for (var i=0; i<objdune.dune.length; i++) {
			// Create holder for each dune
			var duneHolder = $('<div>');
			duneHolder.addClass('characters-dune');
			duneHolder.attr('type',objdune.dune[i]);
			duneHolder.attr('hp',objdune.hp[i]);
			duneHolder.attr('attack',objdune.attack[i]);
			duneHolder.append('<img src="assets/images/' + objdune.dune[i] + '.jpg"/>');
			// Create level
			var level = $('<h6>');
			level.text('Lv30');
			duneHolder.append(level);
			// Create hp bar text
			var hp = $('<h6>');
			hp.text('HP');
			// Create color bar helper
			var colorHelper = $('<div>');
			colorHelper.addClass('hp-bar-color-helper');
			// Create hp bar
			var hpBar = $('<div>');
			hpBar.addClass('hp-bar');
			// Create color bar
			var color = $('<div>');
			color.addClass('hp-bar-color');
			// Append hp and color back to hp bar
			hpBar.append(colorHelper);
			hpBar.append(hp);
			hpBar.append(color);
			// Append hp bar to dune holder
			duneHolder.append(hpBar);
			// Create number hp
			var numberHP = $('<h6>');
			numberHP.text(objdune.hp[i] + ' / ' + objdune.hp[i]);
			duneHolder.append(numberHP);
			// Append holder to characters
			$('.characters').append(duneHolder);
		}
		// Show message
		var h1 = $('<h1>');
		h1.text('Choose Your Character');
		$('.characters').append(h1);
	}

	// When character is clicked
	$('.position-characters').on('click', '.characters-dune', function() {
		// Remove 'choose your character'
		$('.characters h1').remove();
		// Make positioning class for character selection
		var selected = $('<div>');
		selected.addClass('selected-character');
		// Make positioning class for other characters
		var unselected = $('<div>');
		unselected.addClass('unselected-characters');
		// Add divs to position characters
		$('.position-characters').append(selected);
		$('.position-characters').append(unselected);
		// Remove characters-dune class
		$('.characters').children().removeClass('characters-dune');
		// Add selected dune to selected
		character = $(this); 
		selected.append(character);
		// Flip selected dune if Baron or Gurney
		if (character.attr('type') == 'Baron' || character.attr('type') == 'Gurney') {
			character.children("img").addClass('flipped');
		}
		// Add others to unselected
		var otherdune = $(".characters").children();
		unselected.append(otherdune);
		// Remove original dune holder
		$('.position-characters .characters').remove();
		// Add proper sizing
		selected.children().addClass('selected-character-dune');
		unselected.children().addClass('unselected-character-dune');
		// Flip unselected dune if Baron or Gurney
		$('.unselected-character-dune').each(function() {
			var dune = $(this);
			if (dune.attr('type') == 'Paul' || dune.attr('type') == 'Feyd') {
				dune.children("img").addClass('flipped');
			}
		});
		// Show 'your character'
		selected.append('<h1>Your Character</h1>');
		selected.last
		// Show 'choose your opponent'
		unselected.append('<h1>Choose Your Opponent</h1>');
	});

	// When unselected character is clicked
	$('.position-characters').on('click', '.unselected-character-dune', function() {
		// Remove 'your character'
		$('.selected-character h1').remove();
		// Remove 'choose your opponent'
		$('.unselected-characters h1').remove();
		// Make positioning class for sideline characters
		var sidelines = $('<div>');
		sidelines.addClass('sidelines');
		// Make positioning class for battle field
		var battlefield = $('<div>');
		battlefield.addClass('battlefield');
		// Add divs to position characters
		$('.position-characters').append(sidelines);
		$('.position-characters').append(battlefield);
		// Remove selected and unselected character classes
		$('.selected-character').children().removeClass('selected-character-dune');
		$('.unselected-characters').children().removeClass('unselected-character-dune');
		// Add selected character and selected enemy to battlefield
		character = $(".selected-character").children();
		enemy = $(this);
		battlefield.append(character);
		battlefield.append(enemy);
		// Add others characters to sidelines
		var otherdune = $(".unselected-characters").children();
		sidelines.append(otherdune);
		// Remove original selected and unselected character holders
		$('.position-characters .selected-character').remove();
		$('.position-characters .unselected-characters').remove();
		// Add proper sizing
		battlefield.children().addClass('battle-dune');
		sidelines.children().addClass('sideline-dune');
		// Show 'click on enemy to attack'
		var h2 = $('<h2>');
		h2.text('Click On Enemy To Attack');
		battlefield.append(h2);
		// Start the battle
		battle();
	});

	var count = 0;
	function battle() {
		// Turn off sideline dune click
		$('.position-characters').off('click', '.sideline-dune');
		// Initialize variables
		if (battleTimes == 0) {
			characterHPTotal = $('.battle-dune:eq(0)').attr('hp');
			characterHP = characterHPTotal;
			characterAttack = Number($('.battle-dune:eq(0)').attr('attack'));
			originalCharacterAttack = characterAttack;
		}
		// Reinitialize count
		count = 0;
		// Enter click battle
		clickBattle();
		battleTimes++;
	}
	// Function for clicking dune to battle
	function clickBattle() {
		$('.position-characters').on('click', '.battle-dune:eq(1)', function() {
			// Stop click so animation can happen before player clicks again
			$('.position-characters').off('click', '.battle-dune:eq(1)');
			// Remove 'click on enemy to attack' or 'dune defeated'
			$('.battlefield h2').remove();
			$('.battlefield h3').remove();
			if (count == 0) {
				characterName = $('.battle-dune:eq(0)').attr('type');
				enemyName = $('.battle-dune:eq(1)').attr('type');
				enemyAttack = $('.battle-dune:eq(1)').attr('attack');
				enemyHPTotal = $('.battle-dune:eq(1)').attr('hp');
				enemyHP = enemyHPTotal;
				characterHPText = $('.battle-dune:eq(0)').children('h6:eq(1)');
				enemyHPText = $('.battle-dune:eq(1)').children('h6:eq(1)');
			}
			// Create attack messages
			var yourAttackMessage = $('<h3>');
			var enemyAttackMessage = $('<h3>');
			// Append empty tags
			$('.battlefield').append(yourAttackMessage);
			$('.battlefield').append(enemyAttackMessage);
			// Animation logic to show animation when character is alive
			if (characterHP != 0) {
				// Calculate character damage on enemy
		  	enemyHP -= characterAttack;
		  	// Calculate percentage
				enemyPercentage = 86 * enemyHP/enemyHPTotal;
				// See if enemyHP reaches 0
				if (enemyHP <= 0) {
					$('.position-characters').off('click', '.battle-dune:eq(1)');
					enemyHP = 0;
					enemyPercentage = 0;
					// Move battlefield backwards so person can click on sideline dune
					$('.battlefield').css('z-index','-1');
					// Delay defated steps
					window.setTimeout(function() {
						defeated('enemy',1,0,1); // last two inputs are to select the proper dune for rotation
					}, 500);
				}
				// Show CSS animation character if character is not dead
			  $('.battle-dune:eq(0)').addClass('animation-character');
			  $('.battle-dune:eq(0)').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
			    $('.battle-dune:eq(0)').removeClass('animation-character');
			    // Update hp bar
			    $('.battle-dune:eq(1) .hp-bar-color').css('width', String(enemyPercentage) + '%');
			    // Change color to yellow if less than or equal to 50%
					// and red if less than or equal to 20%
			    if (enemyPercentage <= 20) {
						$('.battle-dune:eq(1) .hp-bar-color').css('background', 'red');
					} else if (enemyPercentage<= 50) {
						$('.battle-dune:eq(1) .hp-bar-color').css('background', 'yellow');
					}
			    // Update text
			    enemyHPText.text(enemyHP + ' / ' + enemyHPTotal);
			    // Show attack message
					yourAttackMessage.html('You attacked ' + enemyName + ' for <span style="color:red">' + characterAttack + '</span> damage.');
			    // Check if either player or enemy died
			    if (enemyHP != 0) {
			    	// Calculate enemy damage on character
	    			characterHP -= enemyAttack;
	    			// Calculate percentage
						characterPercentage = 86 * characterHP/characterHPTotal;
						// See if characterHP reaches 0
						if (characterHP <= 0) {
							$('.position-characters').off('click', '.battle-dune:eq(1)');
							characterHP = 0;
							characterPercentage = 0;
							// Delay defated steps
							window.setTimeout(function() {
								defeated('character',0,2,3); // last two inputs are to select the proper dune for rotation
							}, 500);
						}
				    // Show CSS animation enemy if enemy is not dead
					  $('.battle-dune:eq(1)').addClass('animation-enemy');
					  $('.battle-dune:eq(1)').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
					    $('.battle-dune:eq(1)').removeClass('animation-enemy');
					    // Update hp bar
							$('.battle-dune:eq(0) .hp-bar-color').css('width', String(characterPercentage) + '%');
							// Change color to yellow if less than or equal to 50%
							// and red if less than or equal to 20%
					    if (characterPercentage <= 20) {
								$('.battle-dune:eq(0) .hp-bar-color').css('background', 'red');
							} else if (characterPercentage<= 50) {
								$('.battle-dune:eq(0) .hp-bar-color').css('background', 'yellow');
							}
							// Update text
							characterHPText.text(characterHP + ' / ' + characterHPTotal);
							// Show attack message
							enemyAttackMessage.html(enemyName + ' attacked you for <span style="color:red">' + enemyAttack + '</span> damage.');
							// Renew click if neither player is dead
							clickBattle()
					  });
					}
			  });
			}
			// Update character damge and count for next round
			characterAttack += originalCharacterAttack;
			count++;
		});
	}
	// Function for defeated after if statments
	function defeated(person,num,first,second) {
		var show;
		var rotater;
		var h2 = $('<h2>');
		// Turn click handler off
		$('.position-characters').off('click', '.battle-dune:eq(' + num + ')');
		if (person == 'character') {
			// Player is defeated
			show = characterName;
			rotater = 'character';
			// Show 'defeated'
			h2.css('color','yellow');
			h2.text('You Have Been Defeated!');
			// Red battlefield
			$('body').css({
				'background': 'linear-gradient(rgba(255, 0, 0, 0.45), rgba(255, 0, 0, 0.45)),url(assets/images/background.png)',
				'background-position': 'center bottom',
			  '-webkit-background-size': 'cover',
			  '-moz-background-size': 'cover',
			  'background-size': 'cover',
			  '-o-background-size': 'cover'
			});
			$('.battle-dune:eq(1)').css('opacity','0.4');
			// Show 'you lose'
			var loser = $('<h1>');
			loser.addClass('winner');
			loser.text('Sorry! You Lose!');
			$('header').append(loser);
			// Restart
			restart();
		} else {
			// Enemy is defeated
			show = enemyName;
			h2.css('color','yellow')
			h2.text(show + ' Has Been Defeated!');
			// Show 'choose your next opponent'
			var h3 = $('<h3>');
			h3.text('Choose Your Next Opponent');
			$('.sidelines').append(h3);
			// Clicking sideline dune to choose new opponent
			$('.position-characters').on('click', '.sideline-dune', function() {
				// Remove all h2 (and h3) from battlefield and sidelines
				$('.battlefield h2').remove();
				$('.battlefield h3').remove();
				$('.sidelines h3').remove();
				// Remove defeated dune
				$('.battle-dune:eq(1)').remove();
				// Change dune from sideline to battle dune
				$(this).addClass('battle-dune');
				$(this).removeClass('sideline-dune');
				// Move dune to battlefield
				$('.battlefield').append($(this));
				// Float right sideline dune
				$('.sideline-dune').css('float','right');
				// Move battlefield forwards so person can click on battlefield dune
				$('.battlefield').css('z-index','1');
				// Restart battle if more dune
				battle();
			});
		}
		// Show 'has been defeated'
		$('.battlefield').append(h2);
		// Show fainted dune
		$('.battle-dune:eq(' + num + ')').children('img').attr('src','assets/images/fainted' + show + '.png');
		// Rotate fainted dune
		if (show == objdune.dune[first] || show == objdune.dune[second]) {
			$('.battle-dune:eq(' + num + ')').children("img").addClass('rotated-flipped-' + person);
		} else {
			$('.battle-dune:eq(' + num + ')').children("img").addClass('rotated-' + person);
		}
		// Break game if all dune are defeated
		if (battleTimes == 3) {
			// Remove sidelines because there are no more dune
			$('.sidelines').remove();
			// White battlefield
			$('body').css({
				'background': 'linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)),url(assets/images/background.png)',
				'background-position': 'center bottom',
			  '-webkit-background-size': 'cover',
			  '-moz-background-size': 'cover',
			  'background-size': 'cover',
			  '-o-background-size': 'cover'
			});
			$('.battle-dune:eq(1)').css('opacity','0.4');
			// Show 'you win'
			var winner = $('<h1>');
			winner.addClass('winner');
			winner.text('Congratulations! You Win!');
			$('header').append(winner);
			// Restart
			restart();
		}
	}
	function restart() {
		// Show 'restart' button
		var restart = $('<button>');
		restart.addClass('restart');
		restart.text('RESTART');
		$('header').append(restart);
		// When restart button is pressed
		$('header').on('click', '.restart', function() {
			$('header').off('click', '.restart');
			$('.position-characters .sidelines').remove();
			start();
		});
	}
});