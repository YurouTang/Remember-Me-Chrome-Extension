$(function() {

  chrome.storage.local.get('websites', function (result) {
      var array = result.websites;
      array.forEach(function(item) {
        $("#web").append("<li>" + item + "</li>");
      });
  });

  // $('#add').click(function() {
  //   console.log("hello");
  //   var url = $('#new_link').val();
  //   chrome.storage.sync.set({'website': url});
  //   $('#web').text(url);
  //   chrome.storage.sync.get('website', function(website) {
  //     console.log(website.website);
  //   })
  // });

  $('#add').click(function() {

    chrome.storage.local.get({websites: []}, function (result) {
        var url = $('#new_link').val();
        // the input argument is ALWAYS an object containing the queried keys
        // so we select the key we need
        var websiteList = result.websites;
        websiteList.push(url);
        // set the new array value to the same key
        chrome.storage.local.set({websites: websiteList}, function () {
            // you can use strings instead of objects
            // if you don't  want to define default values
            chrome.storage.local.get('websites', function (result) {
                console.log(result.websites);
            });
        });
        $("#web").append("<li>" + url + "</li>");
        $('#new_link').val('');
    });
  })


  $('#clear').click(function() {
    console.log("cleared");
    chrome.storage.local.set({websites: []}, function() {
      $("#web").text("");
    });
  })


  $('#addAll').click(function() {
    chrome.storage.local.get('websites', function(result) {
      chrome.tabs.query({status: "complete"}, function(resultArray) {
        console.log(resultArray);
        resultArray.forEach(function(tab) {
          result.websites.push(tab.url);
          $("#web").append("<li>" + tab.url + "</li>");
        })
        chrome.storage.local.set({websites: result.websites}, function() {
          chrome.storage.local.get('websites', function (result) {
              console.log(result.websites);
          });
        })
      });
    })
  })

  $('#openAll').click(function() {
    chrome.storage.local.get('websites', function(result) {
      resultArray = result.websites;
      resultArray.forEach(function(link) {
        chrome.tabs.create({url:link});
      })
    })
  })

  $('ol').click(function(e) {
    console.log("hello");
    console.log($(e.target).index());
    if (confirm('Would you like to remove link number ' + ($(e.target).index() + 1) + ' from the list?')) {
        // Remove from array
        chrome.storage.local.get('websites', function(result) {
          result.websites.splice($(e.target).index(), 1);
          chrome.storage.local.set({websites: result.websites}, function() {
              // Remove from html list
              $("#web li").eq($(e.target).index()).remove();
          })
        })
        console.log("Removed!");
    } else {
        // Do nothing!
    }
  })

});
