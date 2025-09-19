// ==============================
// Theia Sticky Sidebar
// ==============================
(function($) {
  $.fn.theiaStickySidebar = function(options) {
    var defaults = { additionalMarginTop: 0, additionalMarginBottom: 0, updateSidebarHeight: true, disableOnResponsiveLayouts: true };
    options = $.extend(defaults, options);
    this.each(function() {
      var $sidebar = $(this), $window = $(window), $body = $('body');
      var sidebarHeight, topPadding = options.additionalMarginTop, bottomPadding = options.additionalMarginBottom;

      function updateSidebarPosition() {
        if ($window.width() <= 768 && options.disableOnResponsiveLayouts) {
          $sidebar.css('position', 'static');
          return;
        }
        var scrollTop = $window.scrollTop();
        var offsetTop = $sidebar.offset().top;
        if (scrollTop > offsetTop - topPadding) {
          $sidebar.css({
            position: 'fixed',
            top: topPadding,
            width: $sidebar.parent().width()
          });
        } else {
          $sidebar.css({ position: 'static', width: 'auto' });
        }
      }

      $window.on('scroll resize', updateSidebarPosition);
      updateSidebarPosition();
    });
    return this;
  };
})(jQuery);

// ==============================
// Protect Links
// ==============================
var protected_links = 'blogger.com,fb.com,pinterest.com,facebook.com,linkedin.com,whatsapp.com,youtube.com,fb.me,instagram.com,plus.google.com,twitter.com,saweria.co,sociabuzz.com';
function auto_safelink() {
  // isi fungsi kalau perlu
}

// ==============================
// Overlay Back to Top + Feed Loader
// ==============================
document.addEventListener("DOMContentLoaded", function() {
  function loadFeed(feedUrl, limit, targetSelector, randomize) {
    var container = document.querySelector(targetSelector);
    if (!container) return;

    fetch(feedUrl)
      .then(res => res.json())
      .then(data => {
        var entries = data.feed.entry;
        if (!entries) return;
        if (randomize) entries.sort(() => 0.5 - Math.random());

        var html = '<ul>';
        for (var i = 0; i < Math.min(limit, entries.length); i++) {
          var entry = entries[i];
          var title = entry.title.$t;
          var link = entry.link.find(l => l.rel === 'alternate').href;
          html += '<li><a href="' + link + '">' + title + '</a></li>';
        }
        html += '</ul>';
        container.innerHTML = html;
      })
      .catch(err => console.error('Feed load error:', err));
  }

  // Contoh pemanggilan:
  // loadFeed('https://namablog.blogspot.com/feeds/posts/default?alt=json', 5, '#recent-posts', true);
});

// ==============================
// Menu Builder (Tentang & Lainnya)
// ==============================
$(document).ready(function() {
  // Tentang menu
  $('.menuTentang').html('<ul><li><a href="/p/tentang.html">Tentang</a></li><li><a href="/p/kontak.html">Kontak</a></li></ul>');
  // Lainnya menu
  $('.menuLainnya').html('<ul><li><a href="/p/privacy.html">Privacy</a></li><li><a href="/p/disclaimer.html">Disclaimer</a></li></ul>');
});

// ==============================
// Mobile Menu
// ==============================
document.addEventListener("DOMContentLoaded", function() {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      menu.classList.toggle('active');
    });
  }
});

// ==============================
// Search Toggle
// ==============================
document.addEventListener("DOMContentLoaded", function() {
  var toggle = document.querySelector('.search-toggle');
  var searchBox = document.querySelector('.search-box');
  if (toggle && searchBox) {
    toggle.addEventListener('click', function() {
      searchBox.classList.toggle('active');
    });
  }
});

// ==============================
// Related Posts
// ==============================
function relatedPosts(json) {
  var container = document.getElementById('related-posts');
  if (!container) return;
  var html = '<ul>';
  for (var i = 0; i < json.feed.entry.length; i++) {
    var entry = json.feed.entry[i];
    var title = entry.title.$t;
    var link = entry.link.find(l => l.rel === 'alternate').href;
    html += '<li><a href="' + link + '">' + title + '</a></li>';
  }
  html += '</ul>';
  container.innerHTML = html;
}