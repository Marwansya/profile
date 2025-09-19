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
document.addEventListener("DOMContentLoaded", function () {
  function loadFeed(feedUrl, limit, targetSelector, randomize) {
    var container = document.querySelector(targetSelector);
    if (!container) return;

    fetch(feedUrl)
      .then(res => res.json())
      .then(data => {
        var entries = data.feed.entry;
        if (!entries) {
          container.innerHTML = "<p>Tidak ada posting.</p>";
          return;
        }

        if (randomize) {
          entries.sort(() => 0.5 - Math.random());
        }

        var html = "<ul class='post'>";
        entries.slice(0, limit).forEach(entry => {
          var link = entry.link.find(l => l.rel === "alternate").href;
          var postTitle = entry.title.$t;

          // Format tanggal
          var rawDate = new Date(entry.published.$t);
          var options = { year: "numeric", month: "long", day: "numeric" };
          var date = rawDate.toLocaleDateString("id-ID", options);

          // Ambil thumbnail
          var thumb = "";
          if (entry.media$thumbnail) {
            thumb = entry.media$thumbnail.url.replace("s72-c", "s120-c");
          } else if (entry.content && entry.content.$t.match(/<img/)) {
            var m = entry.content.$t.match(/<img[^>]+src="([^">]+)"/);
            if (m) thumb = m[1];
          } else {
            // Gambar default kalau artikel tidak ada thumbnail
            thumb = "https://i.ibb.co/your-default.jpg";
          }

          html += `
            <li class="post-content">
              <a class="post-image-link" href="${link}">
                <img class="post-thumb" src="${thumb}" alt="${postTitle}">
              </a>
              <div class="post-info">
                <h2 class="post-title"><a href="${link}">${postTitle}</a></h2>
                <div class="post-meta">
                  <span class="post-date">${date}</span>
                </div>
              </div>
            </li>`;
        });
        html += "</ul>";
        container.innerHTML = html;
      })
      .catch(err => {
        console.error("Feed error:", err);
        container.innerHTML = "<p>Error load feed.</p>";
      });
  }

  // Gunakan URL blog langsung, bukan window.location.origin
  var base = "https://marwansya.blogspot.com"; // ganti dengan URL blog kamu

  // Post Acak
  loadFeed(base + "/feeds/posts/summary?alt=json&max-results=50", 3, "#footer-sec1 .widget-content", true);

  // Post Terbaru
  loadFeed(base + "/feeds/posts/summary?alt=json&max-results=3&orderby=published", 3, "#footer-sec2 .widget-content", false);
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