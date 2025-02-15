;(function () {
  function displaySearchResults(results, store, searchTerm) {
    var searchResultsNo = document.getElementById('content_head')
    searchResultsNo.innerHTML = '<p>Search results (' + results.length + ')</p>'

    var searchResults = document.getElementById('content_body')
    searchResults.style.width = '100%'
    var appendString = '<h1 id="search-term">\'' + searchTerm + "'</h1>"

    if (results.length) {
      // Are there any results?
      appendString += '<div class="search-result-content">'
      for (var i = 0; i < results.length; i++) {
        // Iterate over the results
        var item = store[results[i].ref]
        appendString += '<div class="search-result-card"><a href="' + item.url + '">'
        appendString += '<h6>' + item.dir + '</h6>'
        appendString += '<h3>' + item.title + '</h3>'
        appendString += '<p>' + item.content.substring(0, 150) + '...</p>'
        appendString += '</a></div>'
      }
      appendString += '</div>'
    }
    searchResults.innerHTML = appendString
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1)
    var vars = query.split('&')

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'))
      }
    }
  }

  var searchTerm = getQueryVariable('query')

  if (searchTerm) {
    document.getElementById('search_box').setAttribute('value', searchTerm)

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id')
      this.field('title', { boost: 10 })
      this.field('dir')
      this.field('category')
      this.field('content')
    })

    for (var key in window.store) {
      // Add the data to lunr
      idx.add({
        id: key,
        title: window.store[key].title,
        dir: window.store[key].dir,
        category: window.store[key].category,
        content: window.store[key].content,
      })

      var results = idx.search(searchTerm) // Get lunr to perform a search
      displaySearchResults(results, window.store, searchTerm) // We'll write this in the next section
    }
  }
})()
