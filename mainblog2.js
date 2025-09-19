/* ==============================
   Theia Sticky Sidebar (v1.7.0)
   https://github.com/WeCodePixels/theia-sticky-sidebar
================================ */
(function($){
  $.fn.theiaStickySidebar = function(options){
    var defaults = {
      containerSelector: '',
      additionalMarginTop: 0,
      additionalMarginBottom: 0,
      updateSidebarHeight: true,
      minWidth: 0,
      disableOnResponsiveLayouts: true,
      sidebarBehavior: 'modern',
      defaultPosition: 'relative',
      namespace: 'TSS'
    };
    options = $.extend(defaults, options);
    options.additionalMarginTop = parseInt(options.additionalMarginTop) || 0;
    options.additionalMarginBottom = parseInt(options.additionalMarginBottom) || 0;
    tryInitOrHookIntoEvents(options, this);

    function tryInitOrHookIntoEvents(options, $that){
      var success = tryInit(options, $that);
      if(!success){
        console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');
        $(document).on('scroll.'+options.namespace, function(options,$that){
          return function(evt){
            var success = tryInit(options,$that);
            if(success){ $(this).unbind(evt); }
          };
        }(options,$that));
        $(window).on('resize.'+options.namespace, function(options,$that){
          return function(evt){
            var success = tryInit(options,$that);
            if(success){ $(this).unbind(evt); }
          };
        }(options,$that));
      }
    }

    function tryInit(options,$that){
      if(options.initialized===true){ return true; }
      if($('body').width()<options.minWidth){ return false; }
      init(options,$that); return true;
    }

    function init(options,$that){
      options.initialized = true;
      var existingStylesheet = $('#theia-sticky-sidebar-stylesheet-'+options.namespace);
      if(existingStylesheet.length===0){
        $('head').append($('<style id="theia-sticky-sidebar-stylesheet-'+options.namespace+'">.theiaStickySidebar:after {content:""; display:table; clear:both;}</style>'));
      }
      $that.each(function(){
        var o={};
        o.sidebar=$(this);
        o.options=options||{};
        o.container=$(o.options.containerSelector);
        if(o.container.length==0){ o.container=o.sidebar.parent(); }
        o.sidebar.parents().css('-webkit-transform','none');
        o.sidebar.css({
          position:o.options.defaultPosition,
          overflow:'visible',
          '-webkit-box-sizing':'border-box',
          '-moz-box-sizing':'border-box',
          'box-sizing':'border-box'
        });
        o.stickySidebar=o.sidebar.find('.theiaStickySidebar');
        if(o.stickySidebar.length==0){
          var javaScriptMIMETypes=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;
          o.sidebar.find('script').filter(function(index,script){
            return script.type.length===0||script.type.match(javaScriptMIMETypes);
          }).remove();
          o.stickySidebar=$('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());
          o.sidebar.append(o.stickySidebar);
        }
        o.marginBottom=parseInt(o.sidebar.css('margin-bottom'));
        o.paddingTop=parseInt(o.sidebar.css('padding-top'));
        o.paddingBottom=parseInt(o.sidebar.css('padding-bottom'));
        var collapsedTopHeight=o.stickySidebar.offset().top;
        var collapsedBottomHeight=o.stickySidebar.outerHeight();
        o.stickySidebar.css('padding-top',1);
        o.stickySidebar.css('padding-bottom',1);
        collapsedTopHeight-=o.stickySidebar.offset().top;
        collapsedBottomHeight=o.stickySidebar.outerHeight()-collapsedBottomHeight-collapsedTopHeight;
        if(collapsedTopHeight==0){o.stickySidebar.css('padding-top',0);o.stickySidebarPaddingTop=0;}
        else{o.stickySidebarPaddingTop=1;}
        if(collapsedBottomHeight==0){o.stickySidebar.css('padding-bottom',0);o.stickySidebarPaddingBottom=0;}
        else{o.stickySidebarPaddingBottom=1;}
        o.previousScrollTop=null;o.fixedScrollTop=0;resetSidebar();

        o.onScroll=function(o){
          if(!o.stickySidebar.is(":visible")){return;}
          if($('body').width()<o.options.minWidth){resetSidebar();return;}
          if(o.options.disableOnResponsiveLayouts){
            var sidebarWidth=o.sidebar.outerWidth(o.sidebar.css('float')=='none');
            if(sidebarWidth+50>o.container.width()){resetSidebar();return;}
          }
          var scrollTop=$(document).scrollTop();var position='static';
          if(scrollTop>=o.sidebar.offset().top+(o.paddingTop-o.options.additionalMarginTop)){
            var offsetTop=o.paddingTop+options.additionalMarginTop;
            var offsetBottom=o.paddingBottom+o.marginBottom+options.additionalMarginBottom;
            var containerTop=o.sidebar.offset().top;
            var containerBottom=o.sidebar.offset().top+getClearedHeight(o.container);
            var windowOffsetTop=0+options.additionalMarginTop;
            var windowOffsetBottom;
            var sidebarSmallerThanWindow=(o.stickySidebar.outerHeight()+offsetTop+offsetBottom)<$(window).height();
            if(sidebarSmallerThanWindow){
              windowOffsetBottom=windowOffsetTop+o.stickySidebar.outerHeight();
            }else{
              windowOffsetBottom=$(window).height()-o.marginBottom-o.paddingBottom-options.additionalMarginBottom;
            }
            var staticLimitTop=containerTop-scrollTop+o.paddingTop;
            var staticLimitBottom=containerBottom-scrollTop-o.paddingBottom-o.marginBottom;
            var top=o.stickySidebar.offset().top-scrollTop;
            var scrollTopDiff=o.previousScrollTop-scrollTop;
            if(o.stickySidebar.css('position')=='fixed'){
              if(o.options.sidebarBehavior=='modern'){ top+=scrollTopDiff; }
            }
            if(o.options.sidebarBehavior=='stick-to-top'){ top=options.additionalMarginTop; }
            if(o.options.sidebarBehavior=='stick-to-bottom'){ top=windowOffsetBottom-o.stickySidebar.outerHeight(); }
            if(scrollTopDiff>0){ top=Math.min(top,windowOffsetTop); }
            else{ top=Math.max(top,windowOffsetBottom-o.stickySidebar.outerHeight()); }
            top=Math.max(top,staticLimitTop);
            top=Math.min(top,staticLimitBottom-o.stickySidebar.outerHeight());
            var sidebarSameHeightAsContainer=o.container.height()==o.stickySidebar.outerHeight();
            if(!sidebarSameHeightAsContainer&&top==windowOffsetTop){position='fixed';}
            else if(!sidebarSameHeightAsContainer&&top==windowOffsetBottom-o.stickySidebar.outerHeight()){position='fixed';}
            else if(scrollTop+top-o.sidebar.offset().top-o.paddingTop<=options.additionalMarginTop){position='static';}
            else{position='absolute';}
          }
          if(position=='fixed'){
            var scrollLeft=$(document).scrollLeft();
            o.stickySidebar.css({
              position:'fixed',
              width:getWidthForObject(o.stickySidebar)+'px',
              transform:'translateY('+top+'px)',
              left:(o.sidebar.offset().left+parseInt(o.sidebar.css('padding-left'))-scrollLeft)+'px',
              top:'0px'
            });
          }else if(position=='absolute'){
            var css={};
            if(o.stickySidebar.css('position')!='absolute'){
              css.position='absolute';
              css.transform='translateY('+(scrollTop+top-o.sidebar.offset().top-o.stickySidebarPaddingTop-o.stickySidebarPaddingBottom)+'px)';
              css.top='0px';
            }
            css.width=getWidthForObject(o.stickySidebar)+'px';css.left='';
            o.stickySidebar.css(css);
          }else if(position=='static'){resetSidebar();}
          if(position!='static'){
            if(o.options.updateSidebarHeight==true){
              o.sidebar.css({'min-height':o.stickySidebar.outerHeight()+o.stickySidebar.offset().top-o.sidebar.offset().top+o.paddingBottom});
            }
          }
          o.previousScrollTop=scrollTop;
        };
        o.onScroll(o);
        $(document).on('scroll.'+o.options.namespace,function(o){return function(){o.onScroll(o);};}(o));
        $(window).on('resize.'+o.options.namespace,function(o){return function(){o.stickySidebar.css({'position':'static'});o.onScroll(o);};}(o));
        if(typeof ResizeSensor!=='undefined'){ new ResizeSensor(o.stickySidebar[0],function(o){return function(){o.onScroll(o);};}(o)); }

        function resetSidebar(){ o.fixedScrollTop=0;o.sidebar.css({'min-height':'1px'});o.stickySidebar.css({position:'static',width:'',transform:'none'}); }
        function getClearedHeight(e){ var height=e.height(); e.children().each(function(){height=Math.max(height,$(this).height());}); return height; }
      });
    }
    function getWidthForObject(object){ var width; try{width=object[0].getBoundingClientRect().width;}catch(err){} if(typeof width==="undefined"){width=object.width();} return width; }
    return this;
  };
})(jQuery);

/* ==============================
   Protect Link (Safelink)
================================ */
var protected_links = 'blogger.com,fb.com,pinterest.com,facebook.com,linkedin.com,whatsapp.com,youtube.com,fb.me,instagram.com,plus.google.com,twitter.com,saweria.co,sociabuzz.com';
function auto_safelink(){ /* isi fungsinya kalau diperlukan */ }

/* ==============================
   Overlay + Back To Top + Feed Loader
================================ */
document.addEventListener("DOMContentLoaded", function(){
  function loadFeed(feedUrl, limit, targetSelector, randomize){
    var container=document.querySelector(targetSelector);
    if(!container) return;
    fetch(feedUrl).then(res=>res.json()).then(data=>{
      var entries=data.feed.entry;
      if(!entries){ container.innerHTML="<p>Tidak ada posting.</p>"; return; }
      if(randomize){ entries.sort(()=>0.5-Math.random()); }
      var html="<ul class='post'>";
      entries.slice(0,limit).forEach(entry=>{
        var link=entry.link.find(l=>l.rel==="alternate").href;
        var postTitle=entry.title.$t;
        var rawDate=new Date(entry.published.$t);
        var options={year:'numeric',month:'long',day:'numeric'};
        var date=rawDate.toLocaleDateString('id-ID',options);
        var thumb="";
        if(entry.media$thumbnail){ thumb=entry.media$thumbnail.url.replace("s72-c","s120-c"); }
        else if(entry.content && entry.content.$t.match(/<img/)){
          var m=entry.content.$t.match(/<img[^>]+src="([^">]+)"/); if(m) thumb=m[1];
        } else { thumb="https://i.ibb.co/your-default.jpg"; }
        html+=`
          <li class="post-content">
            <a class="post-image-link" href="${link}">
              ${thumb?`<img class="post-thumb" src="${thumb}" alt="${postTitle}">`:""}
            </a>
            <div class="post-info">
              <h2 class="post-title"><a href="${link}">${postTitle}</a></h2>
              <div class="post-meta"><span class="post-date">${date}</span></div>
            </div>
          </li>`;
      });
      html+="</ul>"; container.innerHTML=html;
    }).catch(err=>{
      console.error("Feed error:",err);
      container.innerHTML="<p>Error load feed.</p>";
    });
  }
  var base=window.location.origin;
  loadFeed(base+"/feeds/posts/summary?alt=json&max-results=50",3,"#footer-sec1 .widget-content",true);
  loadFeed(base+"/feeds/posts/summary?alt=json&max-results=3&orderby=published",3,"#footer-sec2 .widget-content",false);
});

/* ==============================
   Menu builder (Tentang & Lainnya)
================================ */
$(document).ready(function(){
  let $menu=$("#main-menu-nav");
  let $items=$menu.find("li");
  let $tentang=null; let $lainnya=null;
  $items.each(function(){
    let $link=$(this).find("a");
    let text=$link.text().trim();
    if(text.startsWith("_")){
      $link.text(text.replace("_",""));
      if($tentang && ($link.text()==="Website"||$link.text()==="Penulis")){
        if($tentang.find("ul").length===0){ $tentang.append("<ul></ul>"); }
        $(this).appendTo($tentang.find("ul"));
      } else if($lainnya){
        if($lainnya.find("ul").length===0){ $lainnya.append("<ul></ul>"); }
        $(this).appendTo($lainnya.find("ul"));
      }
    } else {
      if($link.text().trim()==="Tentang"){ $tentang=$(this); }
      if($link.text().trim()==="Lainnya"){ $lainnya=$(this); }
    }
  });
});

/* ==============================
   Mobile Menu
================================ */
document.addEventListener("DOMContentLoaded", function(){
  const body=document.body;
  const toggle=document.querySelector(".slide-menu-toggle");
  const mainMenu=document.querySelector("#main-menu-nav");
  const mobileMenu=document.querySelector(".mobile-menu");
  if(mainMenu && mobileMenu){ mobileMenu.innerHTML=mainMenu.outerHTML; }
  if(toggle){ toggle.addEventListener("click",()=>body.classList.toggle("nav-active")); }
  if(mobileMenu){
    mobileMenu.querySelectorAll("li").forEach(function(li){
      if(li.querySelector("ul")){
        li.classList.add("has-sub");
        const span=document.createElement("span");
        span.classList.add("submenu-toggle");
        li.insertBefore(span, li.querySelector("ul"));
        span.addEventListener("click", function(e){
          e.preventDefault(); li.classList.toggle("show");
        });
      }
    });
  }
});

/* ==============================
   Search Toggle
================================ */
document.addEventListener("DOMContentLoaded", function(){
  const body=document.body;
  const showBtn=document.querySelector(".show-search");
  const hideBtn=document.querySelector(".hide-search");
  if(showBtn && hideBtn){
    showBtn.addEventListener("click",()=>body.classList.add("search-active"));
    hideBtn.addEventListener("click",()=>body.classList.remove("search-active"));
  }
  const mobileShowBtn=document.querySelector(".show-mobile-search");
  const mobileHideBtn=document.querySelector(".hide-mobile-search");
  if(mobileShowBtn && mobileHideBtn){
    mobileShowBtn.addEventListener("click",()=>body.classList.add("mobile-search-active"));
    mobileHideBtn.addEventListener("click",()=>body.classList.remove("mobile-search-active"));
  }
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){ body.classList.remove("search-active","mobile-search-active"); }
  });
});

/* ==============================
   Related Posts
================================ */
function relatedPosts(json){
  var container=document.querySelector('#related-wrap .related-ready');
  if(!container) return;
  var html="<ul class='related-posts'>";
  if(json.feed && json.feed.entry){
    var maxPosts=3;
    var total=Math.min(json.feed.entry.length,maxPosts);
    for(var i=0;i<total;i++){
      var entry=json.feed.entry[i];
      var postTitle=entry.title.$t;
      var postLink="";
      if(entry.link){
        for(var j=0;j<entry.link.length;j++){
          if(entry.link[j].rel==="alternate"){ postLink=entry.link[j].href; break; }
        }
      }
      html+="<li><a href='"+postLink+"'>"+postTitle+"</a></li>";
    }
  } else {
    html+="<li>No related posts found</li>";
  }
  html+="</ul>";
  container.innerHTML=html;
}