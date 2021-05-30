// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"JVpL":[function(require,module,exports) {
var repoContainer = document.getElementById("container-repo");
var nameContainer = document.getElementById("user-p");
var fullNameContainer = document.getElementById("name-p");
var bioContainer = document.getElementById("bioDesc");
var imageUrl = document.getElementById("avatar"); // require('dotenv').config();
// const dotenv = require('dotenv');
// dotenv.config();
// console.log(process.env)
// console.log(require('dotenv').config())

var apiQuery = '{' + 'user(login: "PejuSalami") {' + 'avatarUrl(size: 120),' + 'bio,' + 'name,' + 'login,' + 'repositories(first: 20) {' + 'totalCount,' + 'nodes {' + 'name,' + 'url,' + 'updatedAt,' + 'forkCount,' + 'stargazerCount,' + 'description,' + 'languages(first: 1) {' + 'edges {' + 'node {' + 'name' + '}' + '}' + '}' + '}' + '}' + '}' + '}';

function fetchGit() {
  fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: apiQuery
    })
  }).then(function (res) {
    return res.json();
  }).then(function (res) {
    var junk = res.data.user; //save user Object

    fullNameContainer.innerHTML = junk.name;
    bioContainer.innerHTML = junk.bio;
    nameContainer.innerHTML = junk.login;
    imageUrl.src = junk.avatarUrl;
    var amount = junk.repositories.totalCount;

    if (amount < 1) {//U don't have an repos
    } else {
      console.log(junk.repositories);
      junk.repositories.nodes.map(function (item) {
        appendNode(item.url, item.name, item.description, item.stargazerCount, item.languages.edges && item.languages.edges[0].node.name, item.forkCount, getDaysAgo(item.updatedAt));
      });
    }

    console.log(res.data);
  });
}

function getDaysAgo(dDate) {
  var today = new Date();
  var datDate = new Date(dDate);
  return Math.round((today - datDate) / (1000 * 3600 * 24));
}

function makeNewRepo(link, name, desc, stars, lang, fork, since) {
  var template = '<div class="repos">' + '<div class="repo-1">' + '<h3 class="repo-text">' + '<span class="repo-name"> <a href="' + link + '"> ' + name + ' </a></span> <br>' + '<span class="repo-dsc"> ' + desc + ' </span>' + '<span ><button class="star">&#9734;star</button></span>' + '</h3>' + '<div class="item-contain">' + '<div class="lang-container">' + '<span class="lang-contain">' + '<span class="repo-color"></span>' + '<span class="repo-lang">  ' + lang + ' </span>' + '</span>' + '</div>' + '<div class="stars-container">' + '<span class="stars-contain">' + '<span><i class="fa fa-star-o" aria-hidden="true"></i></span>' + '<span class="repo-stars">  ' + stars + ' </span>' + '</span>' + '</div>' + '<div class="fork-container">' + '<span class="fork-contain">' + '<span><i class="fa fa-code-fork" aria-hidden="true"></i></span>' + '<span class="repo-fork">  ' + fork + ' </span>' + '</span>' + '<span class="lang-contain">' + '<span class="repo-lang">&nbsp &nbsp &nbsp Updated ' + since + ' days ago</span>' + '</span>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
  return template;
}

function appendNode(link, name, desc, stars, lang, fork, since) {
  var makeNewDiv = document.createElement("div");
  makeNewDiv.innerHTML = makeNewRepo(link, name, desc, stars, lang, fork, since);
  repoContainer.appendChild(makeNewDiv);
}

fetchGit(); // call fetch
},{}]},{},["JVpL"], null)
//# sourceMappingURL=/script.59e780b3.js.map