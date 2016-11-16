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

// Define WoW UI vars
//
var $mainSearch = $('.wow-search');
var $mainLoader = $('.wow-loader.main');
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
  //console.log(globalRealms.realms);
  for(var i in globalRealms.realms){
    realmsArray.push({label: globalRealms.realms[i].name, value: globalRealms.realms[i].slug});
    //$realmSearch.append('<option value="' + globalRealms.realms[i].slug + '">' + globalRealms.realms[i].name + '</option>');
    //console.log(globalRealms.realms[i].name); //names
    //console.log(globalRealms.realms[i].slug); //slugs
    
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
        //$mainError.html('xhr: ' + JSON.stringify(xhr) + '<br />Error: ' + JSON.stringify(status) + '<br />' + JSON.stringify(error));
      }
      
    }
  
  });
  
  // Populate Page with Basic Info
  //
  var $basicArea = $('.wow-container .hero-basic');
  var $heroName = $('[data-wow="hero-name"]');
  var $heroPicture = $('[data-wow="hero-image"]');
  
  function populateBasicInfo(data) {
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
    
    //Insert Character Image
    var crudeImage = data.thumbnail ? data.thumbnail : '';
    var baseImageUrl = 'http://render-api-us.worldofwarcraft.com/static-render/us/';
    var fullImageVariant = crudeImage.replace('-avatar.jpg', '-profilemain.jpg');
    var completedImage = baseImageUrl + fullImageVariant;
    
    $heroPicture.addClass(cleanFaction.toLowerCase());
    $heroPicture.attr('src', completedImage);
    $basicArea.fadeIn(180);
    $heroName.html(data.name + ' <br /><span>(' + data.realm + ' / ' + cleanFaction + ')</span>' + '<br />' + '<span>Level ' + data.level + ' ' + ' ' + cleanRace + ' ' + cleanClass + '</span>' + '<br />' + '<span>');
    
    //Insert Character Items
    // http://us.media.blizzard.com/wow/icons/36/[ITEM NAME HERE].jpg
    //
    var $tooltipContainer = $('#wow-tooltips');
    var $itemsContainer = $('.item-info');
    var $itemLevel = $('[data-wow="item-level"]');
    
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
      var stats = value.stats;
      var cleanStats = {};
      
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
      
      // Get stats from array
      if(stats != undefined) {
        //console.log(stats);
        var i = 0;
        $.each(stats, function(key, value, i) {
          i++;
          cleanStats.stat = value.stat;
          cleanStats.amount = value.amount;
          console.log(cleanStats);
        });
      }
      //console.log(stats);
      
      
      if(name != undefined) { //populate images, skip item levels
        $('[data-slot="' + slot + '"]').html('<img src="' + itemBaseUrl + icon + '.jpg" />');
      }
      
      if(slot === 'averageItemLevelEquipped') {
        $itemLevel.html('Item Level <span>' + value + '</span>');
      }
      
      //Populate Tooltips
      var tooltipOpen = '<div class="item-tooltip" data-wow-tooltip="' + slot + '">';
      var tooltipClose = '</div>';
      var tooltipName = '<span class="item-name color-item-' + quality + '">' + name + '</span>';
      var tooltipLevel = '<span class="item-level color-item-level">Item Level ' + level + '</span>';
      var tooltipSlot = '<span class="item-slot">' + slot.capitalize() + '</span>';
      var tooltipQuality = '<span class="item-quality color-item-uncommon">' + quality.capitalize() + '</span>';
      if(armor != 0) {
        var tooltipArmor = '<span class="item-armor">' + armor + ' Armor</span>';
      } else {
        var tooltipArmor = '';
      }
      
      var tooltipStats = '<span class="item-stat">+' + cleanStats.amount + ' ' + cleanStats.stat + '</span>';
      
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
      
    });
    
  }
  
}

// Item Tooltips - Follow Cursor
//
$('.item-info [data-wow]').mousemove(function(e) {
    if ($(this).attr('data-slot') != "") {
        var slotName = $(this).attr('data-slot');
        $('[data-wow-tooltip="' + slotName + '"]').css('left', e.clientX + 10).css('top', e.clientY + 10).addClass($(this).attr('class'));
        $('[data-wow-tooltip="' + slotName + '"]').show();
    }
});
$('.item-info [data-wow]').mouseleave(function (e) {
    var slotName = $(this).attr('data-slot');
    $('[data-wow-tooltip="' + slotName + '"]').hide();
});