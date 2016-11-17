/*
  Test WoW!
  Grap some WoW info via front-end (insecure local test)
*/

console.log('--> test-wow.js');
console.warn('[test-wow.js - Careful, API Key is exposed!]');

// Helper to Capitalize first word of string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Define Top-Level WoW UI vars
//
var $mainSearch = $('.wow-search');
var $mainLoader = $('.wow-loader');
var $mainArea = $('.wow-container');
var $mainError = $('.wow-error.main');

var $heroSearch = $('#wow-search');
var $realmSearch = $('#wow-search-realm');
var $searchButton = $('#wow-search-submit');

// Shrink/Expand Search Area
//
function searchOpen() {
  TweenLite.to($mainSearch, .35, { autoAlpha: 1, zIndex:800, ease: Power1.easeInOut });
}
function searchClose() {
  
}

// Populate Realms List
//
var realmsArray = [];
function populateRealms() {
  for(var i in globalRealms.realms){
    realmsArray.push({label: globalRealms.realms[i].name, value: globalRealms.realms[i].slug}); 
  }
};
$(document).ready(function() {
  populateRealms();
  var autoCompleteInput = document.getElementById("wow-search-realm");
  new Awesomplete(autoCompleteInput, { minChars: 1, list: realmsArray });
});

// Get Search
//
var searchable = 1;
var characterSearched;
var realmSearched;

$heroSearch.on('keyup', function(e) {if (e.which === 13) {$searchButton.click()} });
$searchButton.on('click', function() {
  
  if( $heroSearch.val() != '' && $realmSearch.val() != 'server' && searchable == 1 ) {
    
    $mainError.fadeOut(180);
    $mainError.removeClass('active');
    $mainLoader.fadeIn(180);
    
    characterSearched = $heroSearch.val().replace(/ /g,'').toLowerCase();
    realmSearched = $realmSearch.val();
    
    console.log('--------------------------');
    console.log('Searching Character: ' + characterSearched);
    console.log('On Realm: ' + realmSearched);
    
    setTimeout(function() {
      searchable = 0;
      var info = buildUrl('character', realmSearched, characterSearched);
      getWowFromSearch(info);
    },100);
    
  } else {
    
    if($mainError.hasClass('active')) {
      $mainError.fadeOut(180);
      setTimeout(function() {
        $mainError.fadeIn(180);
        searchable = 1;
      },200);
    } else {
      $mainError.addClass('active');
      $mainError.fadeIn(180);
      $mainError.html('Error: Enter a Character Name and select a Realm');
      searchable = 1;
    }
    
    
  }
  
});

// Build URL
//
//https://us.api.battle.net/wow/character/chogall/milkme?locale=en_US&apikey=
function buildUrl(calltype, server, name) {
  
  var baseUrl = 'https://us.api.battle.net/wow/';
  var secretUrl = '?fields=items&locale=en_US&jsonp=apiCalled&apikey=cp9c5gugfpezfeewpmj26bme5cehdvx4';
  var finishedUrl = baseUrl + calltype + '/' + server + '/' + name + secretUrl;
  
  if(finishedUrl) {
    console.log('url: ' + finishedUrl);
    return finishedUrl;
  }
  
}

// Keep Track of Characters for Tooltips etc.
var activeCharacter = 0;

// WoW ajax call
// - Grab Character Basic Info + Character Items
//
function getWowFromSearch(info) {
  
  // Callback life
  window.apiCalled = function(data) {
    console.log('WoW API Queried...');
    console.log(data);
  };
  
  // Do ajax call
  $.ajax({
    url: info,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    jsonpCallback: 'apiCalled',
    cache: false,
    timeout: 5000,

    success: function(data) {
      
      $mainError.fadeOut(180);
      $mainError.removeClass('active');
      $mainLoader.fadeOut(180);
      populateBasicInfo(data);
      //$mainArea.append(JSON.stringify(data));
      
      
      setTimeout(function() {
        searchable = 1;
      },150);

    },

    error: function(xhr, status, error) {
      
      $mainLoader.fadeOut(180);
      $mainError.fadeIn(180);
      $mainError.addClass('active');
      searchable = 1;
      
      if(xhr.status === 404) { //Character Not Found
        $mainError.html('Character doesn\'t exist. Make sure you selected a server and try again.');
      } else {
        $mainError.html('Dang...something went very wrong...');
        console.log('xhr: ' + JSON.stringify(xhr));
        console.log('Status: ' + JSON.stringify(status));
        console.log('Error: ' + JSON.stringify(error));
      }
      
    }
  
  });
  
  // Populate Page with Basic Info
  //
  function populateBasicInfo(data) {
    
    var thisCharacter = 'character' + activeCharacter;
    var thisCharacterClass = '.character' + activeCharacter;
    console.log('Populating ' + thisCharacter);
    
    // Add New Character
    var $characterContainerEmpty = $('.hero-empty');
    $characterContainerEmpty.clone().appendTo('.hero-container').removeClass('hero-empty').addClass('hero-insert ' + thisCharacter).fadeIn(180);
    
    //Define Some UI Elements
    var $characterContainer = $(thisCharacterClass + ' .hero-insert ');
    var $characterPanel = $(thisCharacterClass + ' .hero-basic');
    var $heroPicture = $(thisCharacterClass + ' [data-wow="hero-image"]');
    var $heroName = $(thisCharacterClass + ' [data-meta="hero-name"]');
    var $heroLevel = $(thisCharacterClass + ' [data-meta="hero-level"]');
    var $heroServer = $(thisCharacterClass + ' [data-meta="hero-server"]');
    var $heroFaction = $(thisCharacterClass + ' [data-meta="hero-faction"]');
    var $heroClass = $(thisCharacterClass + ' [data-meta="hero-class"]');
    var $heroRace = $(thisCharacterClass + ' [data-meta="hero-race"]');
    
    // Scope clean classes
    var cleanRace;
    var cleanClass;
    var cleanFaction;
    
    // Define Uknown Information (Race, Class, Faction, etc.)
    switch(data.faction) { //Races
      case 1: cleanFaction = 'Horde'; break;
      case 2: cleanFaction = 'Alliance'; break;
      default: cleanFaction = 'Unknown Faction'; break;
    }
    
    // Races
    // https://us.api.battle.net/wow/data/character/races?locale=en_US&apikey=
    switch(data.race) {
      case 1: cleanRace = 'Human'; break;
      case 2: cleanRace = 'Orc'; break;
      case 3: cleanRace = 'Dwarf'; break;
      case 4: cleanRace = 'Night Elf'; break;
      case 5: cleanRace = 'Undead'; break;
      case 6: cleanRace = 'Tauren'; break;
      case 7: cleanRace = 'Gnome'; break;
      case 8: cleanRace = 'Troll'; break;
      case 9: cleanRace = 'Goblin'; break;
      case 10: cleanRace = 'Blood Elf'; break;
      case 11: cleanRace = 'Draenei'; break;
      case 22: cleanRace = 'Worgen'; break;
      case 24: cleanRace = 'Pandaren'; break;
      case 25: cleanRace = 'Pandaren'; break;
      case 26: cleanRace = 'Pandaren'; break;
      default: cleanRace = 'Unknown Race'; break;
    }
    
    // Classes
    // https://us.api.battle.net/wow/data/character/classes?locale=en_US&apikey=
    switch(data.class) {
      case 1: cleanClass = 'Warrior'; break;
      case 2: cleanClass = 'Paladin'; break;
      case 3: cleanClass = 'Hunter'; break;
      case 4: cleanClass = 'Rogue'; break;
      case 5: cleanClass = 'Priest'; break;
      case 6: cleanClass = 'Death Knight'; break;
      case 7: cleanClass = 'Shaman'; break;
      case 8: cleanClass = 'Mage'; break;
      case 9: cleanClass = 'Warlock'; break;
      case 10: cleanClass = 'Monk'; break;
      case 11: cleanClass = 'Druid'; break;
      case 12: cleanClass = 'Demon Hunter'; break;
      default: cleanClass = 'Unknown Class'; break;
    }
    
    //Insert Character Meta
    $heroName.html(data.name);
    $heroLevel.html('Level ' + data.level);
    $heroServer.html(data.realm);
    $heroFaction.addClass(cleanFaction.toLowerCase()).html(cleanFaction);
    $heroClass.html(cleanClass);
    $heroRace.html(cleanRace);
    
    //Insert Character Image
    var crudeImage = data.thumbnail ? data.thumbnail : '';
    var baseImageUrl = 'http://render-api-us.worldofwarcraft.com/static-render/us/';
    var fullImageVariant = crudeImage.replace('-avatar.jpg', '-profilemain.jpg');
    var completedImage = baseImageUrl + fullImageVariant;
    
    $heroPicture.addClass(cleanFaction.toLowerCase());
    $heroPicture.attr('src', completedImage);
    
    //Insert Character Items
    // http://us.media.blizzard.com/wow/icons/36/[ITEM NAME HERE].jpg
    //
    var $tooltipContainer = $(thisCharacterClass + ' .wow-tooltips');
    var $itemsContainer = $(thisCharacterClass + ' .item-info');
    var $itemLevel = $(thisCharacterClass + ' [data-wow="item-level"]');
    
    // Reset tooltip container (in case somebody searches back to back)
    $tooltipContainer.html('');
    $(thisCharacterClass + ' .item-info [data-wow]').html('');
    
    // Loop Items
    var heroItems = data.items;
    var itemBaseUrl = 'http://us.media.blizzard.com/wow/icons/36/';
    
    $.each(heroItems, function(key, value) {
      var slot = key;
      var icon = value.icon ? value.icon : value;
      var name = value.name;
      var quality = value.quality;
      var level = value.itemLevel;
      var armor = value.armor;
      
      // Get name of item quality
      switch(quality) {
        case 0: quality = 'poor'; break;
        case 1: quality = 'common'; break;
        case 2: quality = 'uncommon'; break;
        case 3: quality = 'rare'; break;
        case 4: quality = 'epic'; break;
        case 5: quality = 'legendary'; break;
        case 6: quality = 'artifact'; break;
        case 7: quality = 'heirloom'; break;
        case 8: quality = 'token'; break;
        default: quality = 'common'; break;
      }
      
      if(name != undefined) { //populate images, skip item levels 
        $(thisCharacterClass + ' [data-slot="' + slot + '"]').html('<img src="' + itemBaseUrl + icon + '.jpg" />');
      }
      
      if(slot === 'averageItemLevelEquipped') {
        $itemLevel.html('Item Level <span>' + value + '</span>');
      }
      
      //Populate Tooltips
      var tooltipOpen = '<div class="item-tooltip" data-wow-tooltip="' + slot + '">';
      var tooltipClose = '</div>';
      var tooltipName = '<span class="item-name color-item-' + quality + '">' + name + '</span>';
      var tooltipLevel = '<span class="item-level color-item-level">Item Level ' + level + '</span>';
      var tooltipSlot = '<span class="item-slot">' + slot.capitalize().replace('2', '').replace('1','') + '</span>';
      var tooltipQuality = '<span class="item-quality color-item-uncommon">' + quality.capitalize() + '</span>';
      
      if(armor != 0) {
        var tooltipArmor = '<span class="item-armor">' + armor + ' Armor</span>';
      } else {
        var tooltipArmor = '';
      }
      
      //Tooltip Stats - these get populated in a separate loop (below)
      var tooltipStats = '<div class="item-stats ' + slot + '"></div>';
      
      if(name != undefined) {
        $tooltipContainer.append(
          tooltipOpen +
          tooltipName +
          tooltipQuality +
          tooltipLevel +
          tooltipSlot +
          tooltipArmor +
          tooltipStats +
          tooltipClose
        );
        
      }
      
      // Display Tooltips for Unequipped items
      // - (they don't exist in the item json if they aren't equipped)
      $('.character' + activeCharacter + ' [data-slot]').each(function() {
        var $self = $(this);
        var slot = $self.attr('data-slot');
        var cleanSlotName = slot;
        
        switch(cleanSlotName) {
          case cleanSlotName='offHand': cleanSlotName = 'off Hand';break;
          case cleanSlotName='finger1': cleanSlotName = 'finger';break;
          case cleanSlotName='finger2': cleanSlotName = 'finger';break;
          case cleanSlotName='trinket1': cleanSlotName = 'trinket';break;
          case cleanSlotName='trinket2': cleanSlotName = 'trinket';break;
          default: cleanSlotName = slot;
        }
        
        if(!$('.character' + activeCharacter + ' [data-wow-tooltip="' + slot + '"]').length) {
          $tooltipContainer.append(
            '<div class="item-tooltip" data-wow-tooltip="' + slot + '">' +
            '<span class="item-name color-item-level">' + cleanSlotName.capitalize() + '</span>' + 
            '<span class="color-item-poor">Not Equipped</span></div>'
          );
        }
        
      });
      
    });
    
    // Loop back through and append item stats
    $.each(heroItems, function(key, value) {
      var slot = key;
      var stats = value.stats;
      var $statsContainer = $('.character' + activeCharacter + ' .item-stats.' + slot);
      
      // Get item stats from array
      if(stats != undefined) {
        for (var i = 0; i < stats.length; i++) {
          switch(stats[i].stat) {
            case 0:stats[i].stat = "Mana";break;
            case 1:stats[i].stat = "Health";break;
            case 3:stats[i].stat = "Agility";break;
            case 4:stats[i].stat = "Strength";break;
            case 5:stats[i].stat = "Intellect";break;
            case 6:stats[i].stat = "Spirit";break;
            case 7:stats[i].stat = "Stamina";break;
            case 12:stats[i].stat = "Defense";break;
            case 13:stats[i].stat = "Dodge";break;
            case 14:stats[i].stat = "Parry";break;
            case 15:stats[i].stat = "Block";break;
            case 16:stats[i].stat = "Hit (Melee)";break;
            case 17:stats[i].stat = "Hit (Ranged)";break;
            case 18:stats[i].stat = "Hit (Spell)";break;
            case 19:stats[i].stat = "Critical Strike (Melee)";break;
            case 20:stats[i].stat = "Critical Strike (Ranged)";break;
            case 21:stats[i].stat = "Critical Strike (Spell)";break;
            case 22:stats[i].stat = "Hit Avoidance (Melee)";break;
            case 23:stats[i].stat = "Hit Avoidance (Ranged)";break;
            case 24:stats[i].stat = "Hit Avoidance (Spell)";break;
            case 25:stats[i].stat = "Critical Strike Avoidance (Melee)";break;
            case 26:stats[i].stat = "Critical Strike Avoidance (Ranged)";break;
            case 27:stats[i].stat = "Critical Strike Avoidance (Spell)";break;
            case 28:stats[i].stat = "Haste (Melee)";break;
            case 29:stats[i].stat = "Haste (Ranged)";break;
            case 30:stats[i].stat = "Haste (Spell)";break;
            case 31:stats[i].stat = "Hit";break;
            case 32:stats[i].stat = "Critical Strike";break;
            case 33:stats[i].stat = "Hit Avoidance";break;
            case 34:stats[i].stat = "Critical Strike Avoidance";break;
            case 35:stats[i].stat = "PvP Resilience";break;
            case 36:stats[i].stat = "Haste";break;
            case 37:stats[i].stat = "Expertise";break;
            case 38:stats[i].stat = "Attack Power";break;
            case 39:stats[i].stat = "Ranged Attack Power";break;
            case 40:stats[i].stat = "Versatility";break;
            case 41:stats[i].stat = "Bonus Healing";break;
            case 42:stats[i].stat = "Bonus Damage";break;
            case 43:stats[i].stat = "Mana Regeneration";break;
            case 44:stats[i].stat = "Armor Penetration";break;
            case 45:stats[i].stat = "Spell Power";break;
            case 46:stats[i].stat = "Health Per 5 Sec.";break;
            case 47:stats[i].stat = "Spell Penetration";break;
            case 48:stats[i].stat = "Block Value";break;
            case 49:stats[i].stat = "Mastery";break;
            case 50:stats[i].stat = "Bonus Armor";break;
            case 51:stats[i].stat = "Fire Resistance";break;
            case 52:stats[i].stat = "Frost Resistance";break;
            case 53:stats[i].stat = "Holy Resistance";break;
            case 54:stats[i].stat = "Shadow Resistance";break;
            case 55:stats[i].stat = "Nature Resistance";break;
            case 56:stats[i].stat = "Arcane Resistance";break;
            case 57:stats[i].stat = "PvP Power";break;
            case 58:stats[i].stat = "Amplify";break;
            case 59:stats[i].stat = "Multistrike";break;
            case 60:stats[i].stat = "Readiness";break;
            case 61:stats[i].stat = "Speed";break;
            case 62:stats[i].stat = "Leech";break;
            case 63:stats[i].stat = "Avoidance";break;
            case 64:stats[i].stat = "Indestructible";break;
            case 65:stats[i].stat = "Unused 7";break;
            case 66:stats[i].stat = "Cleave";break;
            case 67:stats[i].stat = "Versatility";break; 
            default:stats[i].stat = "(Uknown Stat)";
          }
          $statsContainer.append(
            '<span class="item-stat">+' + stats[i].amount + ' ' + stats[i].stat + '</span>'
          );
        }
      }
    });
    
    // Item Tooltips - Follow Cursor
    //
    $('.' + thisCharacter + ' .item-info [data-wow]').mousemove(function(e) {
        if ($(this).attr('data-slot') != "") {
            var slotName = $(this).attr('data-slot');
            $('.' + thisCharacter + ' [data-wow-tooltip="' + slotName + '"]').css('left', e.clientX + 10).css('top', e.clientY + 10);
            $('.' + thisCharacter + ' [data-wow-tooltip="' + slotName + '"]').show();
        }
    });
    $('.' + thisCharacter + ' .item-info [data-wow]').mouseleave(function (e) {
        var slotName = $(this).attr('data-slot');
        $('.' + thisCharacter + ' [data-wow-tooltip="' + slotName + '"]').hide();
    });
    
    activeCharacter++;
    
  }//end populateBasicInfo()
  
}//end getWowFromSearch()
