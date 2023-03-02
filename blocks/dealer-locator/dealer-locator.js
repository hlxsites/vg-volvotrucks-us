import { loadCSS, loadScript } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  loadCSS('/blocks/dealer-locator/jquery-ui.css');
  await loadScript('/blocks/dealer-locator/jquery.min.js', { type: 'text/javascript', charset: 'UTF-8' });

  window.locatorConfig = {
    asist: false,
    showAsistDialog: true,
    consolidateFilters: true,
    selectedBrand: 'volvo',
    dataSource: 'https://mvservices.na.volvogroup.com/Volvo_DealerJSON.ashx',
    amenities: ['Appointments Accepted', 'Bilingual Service', 'Driver Lounge', 'Free Pickup and Delivery', 'Hotel Shuttle', 'Internet Service', 'Laundry', 'Showers', 'Telephones', 'Trailer Parking', 'Video Games'],
  };

  loadCSS('/blocks/dealer-locator/main.css');
  loadScript('/blocks/dealer-locator/moment.js', { type: 'text/javascript', charset: 'UTF-8' });
  loadScript('/blocks/dealer-locator/moment-timezone.min.js', { type: 'text/javascript', charset: 'UTF-8' });
  loadScript('/blocks/dealer-locator/dealer-locator-map.js', { type: 'text/javascript', charset: 'UTF-8' });
  loadScript('/blocks/dealer-locator/my-dealer.js', { type: 'text/javascript', charset: 'UTF-8' });
  loadScript('/blocks/dealer-locator/bootstrap.min.js', { type: 'text/javascript', charset: 'UTF-8' });

  block.innerHTML = `
 <form method="post" action="/find-a-dealer/" id="Form1">
<div class="aspNetHidden">
<input type="hidden" name="__EVENTTARGET" id="__EVENTTARGET" value="">
<input type="hidden" name="__EVENTARGUMENT" id="__EVENTARGUMENT" value="">
<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="mawgZpwF7Zho1D1dxNhjF+GFRXdcNExFKtVqwYOh7qal1TbXE7lDgJzC70OfWAA3zg5JPIng5HGpKgMV9BXo1SHfEIgKw57BPOe2ndQdwvLoDj0PnxUxF9qmgs6LB566CLRo9XFdykOC6bleK9fDHUL0Fxg=" />
</div>

 


<div class="aspNetHidden">

	<input type="hidden" name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value="6D4971F0" />
</div>


        


    
    

<input type="hidden" class="predictionCharLimit" value="1" />

    
    <header class="hidden-xs hidden-sm refresh-header-mobile mobile-menu" id="header">
        <div class="container">
            <div class="header-container">
                <div class="logo">
                    
                    <a href="https://www.volvotrucks.us/">
                        
                        <img src="https://www.volvotrucks.us/-/media/vtna/images/shared/header-and-footer/volvo-word-mark-spread.svg?rev=fcc7f51c0a0f483aab56592a3662d20e" alt="Volvo Word Mark Spread Logo" class="img-responsive mobile-img">
                        
                    </a>
                    
                </div>
                <div class="title">
                    
                    <span class="section">Trucks</span>
                    
                    <span class="location">USA</span>
                    
                </div>
                <div class="mobile-menu-container">
                    
                    <a data-toggle="collapse" data-target="#mobile-search-container" id="search-expand" class="search-btn-toggle">
          
                        <img src="https://www.volvotrucks.us/-/media/header-icons/search-icon.png?rev=dd25f6996d484e9bb5fb26fc1e80479c" alt="Volvo Word Mark Spread Logo" class="search-logo">
          
                    
          </a>
                    
                    <a href="#" class="hamburger side-menu-open"><img src="/icons/Hamburger-mobile.png" /></a>
                </div>
            </div>
        </div>

        
        <div id="mobile-search-container" class="collapse">
            <div class="container">
                <div class="row">
                    <div class="menu-container col-sm-12">
                        <div class="form-inline search-form" _lpchecked="1">
                            <div class="form-group search-box-container">
                                <label class="sr-only" for="searchInput">Search Term</label>
                                <input autocomplete="off" type="text" class="form-control typeahead" id="searchText_mobile" placeholder="Search for" onkeypress="searchKeyCheck(event, this, 'us', '/search-results/')">
                            </div>
                            <a href="javascript:submitSearch($('#searchText_mobile'), 'us', '/search-results/')" class="search-btn"><span class="sr-only">search</span><i class="fa fa-search"></i> </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        

        <div class="side-nav-container">
            <div class="top-links">
                
                <ul class="icon-links">
                    
                    <li>
                        <a href="https://www.volvotrucks.us/find-a-dealer/">
                            <div class="icon-container-mobile">
                            <img src="https://www.volvotrucks.us/-/media/header-icons/dealer-desktop.png?rev=8d276535185641f7a4b7bc672e5b0548" alt="Header Icon" />
                                </div>
                            Find a Dealer

                        </a>

                    </li>
                    
                    <li>
                        <a href="https://www.volvotrucks.us/purchasing-a-truck/">
                            <div class="icon-container-mobile">
                            <img src="https://www.volvotrucks.us/-/media/header-icons/products_v_vtna_black.png?rev=ff2ea58b8b55418dbb27be1b7eed9551" alt="Header Icon" />
                                </div>
                            Purchase A Truck

                        </a>

                    </li>
                    
                    <li>
                        <a href="https://www.volvotrucks.com/splash/">
                            <div class="icon-container-mobile">
                            <img src="https://www.volvotrucks.us/-/media/header-icons/world_globe_black.png?rev=17c62a113de74d188a434e503bced2c6" alt="Header Icon" />
                                </div>
                            USA

                        </a>

                    </li>
                    
                    <li>
                        <a href="http://www.volvobrandshop.com/">
                            <div class="icon-container-mobile">
                            <img src="https://www.volvotrucks.us/-/media/header-icons/shopping-cart.svg?rev=7b36b60fb1ce439a8e49ae9095b12d47" alt="Header Icon" />
                                </div>
                            Volvo store

                        </a>

                    </li>
                    
                    <li>
                        <a href="https://customerportal.volvo.com">
                            <div class="icon-container-mobile">
                            <img src="https://www.volvotrucks.us/-/media/header-icons/people_person_black.png?rev=b13fc7d7785d41d389bef97a66069dcb" alt="Header Icon" />
                                </div>
                            Log In

                        </a>

                    </li>
                    
                    <li class="close-icon">
                        <a href="#" class="hamburger side-menu-close"><img src="/icons/Close-Icons.png" /></a>
                    </li>
                </ul>
                
            </div>
            <section data-accordion-group class="main-nav">
                
                <section class="side-nav-accordion" data-accordion>
                    <a data-control class="first-level">Trucks</a>
                    <div data-content>
                        <div class="first-level-item">
                            <a href="https://www.volvotrucks.us/trucks/" class="second-level no-children">Overview</a>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Trucks
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/vnr-electric/" class="third-level">Volvo VNR Electric</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/vnr/" class="third-level">Volvo VNR</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/vnl/" class="third-level">Volvo VNL</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/vnx/" class="third-level">Volvo VNX</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/vhd/" class="third-level">Volvo VHD</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/vah/" class="third-level">Volvo VAH</a>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Powertrain
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/powertrain/i-torque/" class="third-level">I-Torque</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/powertrain/d13tc/" class="third-level">D13TC</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/powertrain/d11/" class="third-level">D11</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/powertrain/d13/" class="third-level">D13</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/powertrain/cummins-x15/" class="third-level">Cummins X15</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/powertrain/i-shift-transmission/" class="third-level">I-Shift Transmission</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/powertrain/natural-gas/" class="third-level">Natural Gas</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/trucks/emissions/" class="third-level">Emissions</a>
                                    </div>
                                </div>
                                
                        </div>
                    </div>
                </section>
                
                <section class="side-nav-accordion" data-accordion>
                    <a data-control class="first-level">Services</a>
                    <div data-content>
                        <div class="first-level-item">
                            <a href="https://www.volvotrucks.us/parts-and-services/" class="second-level no-children">Overview</a>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Parts
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/parts/genuine/" class="third-level">Genuine</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/parts/remanufactured/" class="third-level">Volvo Reman</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/parts/all-makes/" class="third-level">All-Makes</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/parts/partsasist/" class="third-level">PartsASIST</a>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Services
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/services/uptime-service-solutions/" class="third-level">Uptime Service Solutions</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/services/service-and-maintenance-intervals/" class="third-level">Service &amp; Maintenance Intervals</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/services/body-builder-support/" class="third-level">Body Builder Support</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/services/warranty/" class="third-level">Warranty</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/services/resources/" class="third-level">Resources &amp; Manuals</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/services/faqs/" class="third-level">FAQs</a>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Fleets
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/fleets/fleetpreferred/" class="third-level">FleetPreferred</a>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Training
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/training/driver-training/" class="third-level">Video Walkarounds</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/parts-and-services/training/service-tech-training/" class="third-level">Service Tech Training</a>
                                    </div>
                                </div>
                                
                        </div>
                    </div>
                </section>
                
                <section class="side-nav-accordion" data-accordion>
                    <a data-control class="first-level">About Volvo</a>
                    <div data-content>
                        <div class="first-level-item">
                            <a href="https://www.volvotrucks.us/about-volvo/" class="second-level no-children">Overview</a>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Our Difference
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/our-difference/uptime-and-connectivity/" class="third-level">Uptime and Connectivity</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/our-difference/safety/" class="third-level">Safety</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/our-difference/driver-productivity/" class="third-level">Driver Productivity</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/our-difference/fuel-efficiency/" class="third-level">Fuel Efficiency</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/our-difference/uptime-and-connectivity/fleet-management/" class="third-level">Fleet Management</a>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Innovation
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/innovation/supertruck/" class="third-level">SuperTruck</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/innovation/electromobility/" class="third-level">Electromobility</a>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Our Story
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/about-volvo/history/" class="third-level">History</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/about-volvo/facilities/" class="third-level">Facilities</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/links/megamenu/careers/" class="third-level">Careers</a>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    Events
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/about-volvo/events/act-expo/" class="third-level">ACT Expo</a>
                                    </div>
                                </div>
                                
                        </div>
                    </div>
                </section>
                
                <section class="side-nav-accordion" data-accordion>
                    <a data-control class="first-level">News &amp; Stories</a>
                    <div data-content>
                        <div class="first-level-item">
                            <a href="https://www.volvotrucks.us/news-and-stories/" class="second-level no-children">Overview</a>
                            
                            <div class="side-nav-accordion"  data-accordion>
                                <a data-control class="second-level">
                                    News &amp; Stories
                                </a>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/news-and-stories/volvo-trucks-magazine/" class="third-level">Volvo Trucks Magazine</a>
                                    </div>
                                </div>
                                
                                <div data-content>
                                    <div class="third-level-item">
                                        <a href="https://www.volvotrucks.us/news-and-stories/press-releases/" class="third-level">Press Releases</a>
                                    </div>
                                </div>
                                
                        </div>
                    </div>
                </section>
                
            </section>
            
        </div>
        
    </header>
    



<header class="refresh-header desktop-header" id="header">
    <div class="container">
        <div class="header-container">

            <div class="header-meta-links-container">
                <div class="header-meta-links">
                    
                    <ul class="top-links list-inline right-links">
                        
                                <li>
                                    
                                    <div class="icon-container">
									<img src="https://www.volvotrucks.us/-/media/header-icons/dealer-desktop.png?rev=8d276535185641f7a4b7bc672e5b0548" alt="Header Icon" />
                                        </div>
                <a href="https://www.volvotrucks.us/find-a-dealer/" class="openfindadealer">Find a Dealer</a>
                                        
                                    
                                            <div class="ancillaryNavPopup findadealer"></div>
                                      
                  
                  
                                </li>
                        
                                <li>
                                    
                                    <div class="icon-container">
									<img src="https://www.volvotrucks.us/-/media/header-icons/products_v_vtna_black.png?rev=ff2ea58b8b55418dbb27be1b7eed9551" alt="Header Icon" />
                                        </div>
                <a href="https://www.volvotrucks.us/purchasing-a-truck/" class="openpurchaseatruck">Purchase A Truck</a>
                                        
                                    
                                            <div class="ancillaryNavPopup purchaseatruck"></div>
                                      
                  
                  
                                </li>
                        
                                <li>
                                    
                                    <div class="icon-container">
									<img src="https://www.volvotrucks.us/-/media/header-icons/world_globe_black.png?rev=17c62a113de74d188a434e503bced2c6" alt="Header Icon" />
                                        </div>
                <a href="https://www.volvotrucks.com/splash/" class="openusa">USA</a>
                                        
                                    
                                            <div class="ancillaryNavPopup usa"></div>
                                      
                  
                  
                                </li>
                        
                                <li>
                                    
                                    <div class="icon-container">
									<img src="https://www.volvotrucks.us/-/media/header-icons/shopping-cart.svg?rev=7b36b60fb1ce439a8e49ae9095b12d47" alt="Header Icon" />
                                        </div>
                <a href="http://www.volvobrandshop.com/" class="openvolvostore">Volvo store</a>
                                        
                                    
                                            <div class="ancillaryNavPopup volvostore"></div>
                                      
                  
                  
                                </li>
                        
                                <li>
                                    
                                    <div class="icon-container">
									<img src="https://www.volvotrucks.us/-/media/header-icons/people_person_black.png?rev=b13fc7d7785d41d389bef97a66069dcb" alt="Header Icon" />
                                        </div>
                <a href="https://customerportal.volvo.com" class="openlogin">Log In</a>
                                        
                                    
                                            <div class="ancillaryNavPopup login"></div>
                                      
                  
                  
                                </li>
                        
                    </ul>
                    
                </div>
            </div>
            <div class="header-primary-container">
                <div id="http://www.volvotrucks.us/organization" itemid="http://www.volvotrucks.us/organization" itemscope itemtype="http://schema.org/Organization" class="logo-container">
                    
                    <div class="logo">
                        <meta itemprop="name" content="Volvo Trucks USA" />
                        <meta itemprop="url" content="http://www.volvotrucks.us/" />
                        <meta itemprop="foundingDate" content="1928" />
                        <meta itemprop="foundingLocation" content="Gothenburg, Sweden" />
                        <span itemprop="telephone" style="display: none">+1 (336) 393-2000</span>
                        
                        <a href="https://www.volvotrucks.us/">
                            
                            <img itemprop="logo" src="https://www.volvotrucks.us/-/media/vtna/images/shared/header-and-footer/volvo-word-mark-spread.svg?rev=fcc7f51c0a0f483aab56592a3662d20e" alt="Volvo Word Mark Spread Logo" class="img-responsive" width="640" height="360">
                            
                        </a>
                        
                        <meta itemprop="sameAs" content="https://www.facebook.com/VolvoTrucksUnitedStates" />
                        <meta itemprop="sameAs" content="https://www.youtube.com/user/VolvoTrucksUSA" />
                        <meta itemprop="sameAs" content="https://twitter.com/VolvoTrucksNA" />
                        <meta itemprop="sameAs" content="https://www.instagram.com/volvotrucksna/" />
                        <meta itemprop="sameAs" content="https://www.pinterest.com/volvotrucksusa/" />
                    </div>
                    
                    <div class="title">
                        
                        <span class="section">Trucks</span>
                        
                        <span class="location">USA</span>
                        
                    </div>
                    
                </div>
                
                
                <div class="menu-container">
                    <div class="form-inline search-form" _lpchecked="1">
                        <div class="form-group search-box-container">
                            <label class="sr-only" for="searchInput">Search Term</label>
                            <input type="text" autocomplete="off" class="form-control typeahead" id="searchText_desktop" placeholder="Search for" onkeypress="searchKeyCheck(event, this, 'us', '/search-results/')">
                        </div>
                        <a href="javascript:submitSearch($('#searchText_desktop'), 'us', '/search-results/')" class="search-btn"><span class="sr-only">search</span>
                            
                        <img src="https://www.volvotrucks.us/-/media/header-icons/search-icon.png?rev=dd25f6996d484e9bb5fb26fc1e80479c" alt="Volvo Word Mark Spread Logo" class="search-logo">
            
                        
                        </a>
            
                    </div>
                </div>
                
            </div>
        </div>
    </div>

    <div class="navbar">
                    <div class="container">
                        <ul itemscope itemtype="http://www.schema.org/siteNavigationElement" class="nav list-inline">
                            
                            <li itemprop="name">

                                
                                <a itemprop="url" href="javascript:void(0)" data-target="6b6e1b23b17945b0b0df3ef47d9d525c" onclick="megamenuRefresh(this,'https://www.volvotrucks.us/trucks/');">Trucks <i style="margin-left: 5px; width: 1px;" class="fa fa-angle-right"></i></a>

                                
                            </li>
                            
                            <li itemprop="name">

                                
                                <a itemprop="url" href="javascript:void(0)" data-target="ed51f7eed42f4bffa27bbf63f653d58d" onclick="megamenuRefresh(this,'https://www.volvotrucks.us/parts-and-services/');">Services <i style="margin-left: 5px; width: 1px;" class="fa fa-angle-right"></i></a>

                                
                            </li>
                            
                            <li itemprop="name">

                                
                                <a itemprop="url" href="javascript:void(0)" data-target="c4d1434423b14d73805dfc78fcfcd797" onclick="megamenuRefresh(this,'https://www.volvotrucks.us/about-volvo/');">About Volvo <i style="margin-left: 5px; width: 1px;" class="fa fa-angle-right"></i></a>

                                
                            </li>
                            
                            <li itemprop="name">

                                
                                <a itemprop="url" href="javascript:void(0)" data-target="468465c400e343c496227ff62880bb03" onclick="megamenuRefresh(this,'https://www.volvotrucks.us/news-and-stories/');">News &amp; Stories <i style="margin-left: 5px; width: 1px;" class="fa fa-angle-right"></i></a>

                                
                            </li>
                            
                        </ul>
                        
                    </div>
                </div>

    <div class="navbar">
        <div class="container">
            <div class="nav">
                
                <div class="mega-menu" id="6b6e1b23b17945b0b0df3ef47d9d525c">
                    
                    <div class="row mega-menu-padding">
                        <div class="col-md-12">

                            

                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-10 col-md-offset-1">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/trucks/" target="">Trucks</a></h3>
                                            
                                                <p class="description">Find a Volvo truck that&#39;s perfect for your needs.</p>
                                            </div>
                                            
                                    </div>
                                </div>
                                <!-- list the pages associated with the current group -->
                                

                                <div class="row">
                                    
                                    <div class="col-md-2 col-md-offset-1">
                                        <div class="product">
                                            <div>
                                                
                                                <a href="https://www.volvotrucks.us/trucks/vnr-electric/" class="image-container">
                                                    <img itemprop="image" src="https://www.volvotrucks.us/-/media/vtna/images/refresh/mega-menu/vnr-electric.jpg?rev=a955dca7a77e4b3a91e0d4e86a0bc135" class="img-responsive" alt="Volvo VNR Electric Truck">
                                                </a>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/vnr-electric/">Volvo VNR Electric</a>
                                                    
                                                    <p itemprop="description">The future is now.</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <a href="https://www.volvotrucks.us/trucks/vnr/" class="image-container">
                                                    <img itemprop="image" src="https://www.volvotrucks.us/-/media/vtna/images/refresh/mega-menu/vnr.jpg?rev=1869a76c4c934f2f810ac2cbb151513a" class="img-responsive" alt="Volvo Trucks VNR cabin">
                                                </a>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/vnr/">Volvo VNR</a>
                                                    
                                                    <p itemprop="description">The future of regional hauling - today.</p>
                                                    
                                                    <a href="https://www.volvotrucks.us/trucks/build/" target="" class="cta thin">Build Your VNR</a>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <a href="https://www.volvotrucks.us/trucks/vnl/" class="image-container">
                                                    <img itemprop="image" src="https://www.volvotrucks.us/-/media/vtna/images/refresh/mega-menu/vnl-25.jpg?rev=8ada3720a6124944be22586eae2acc1e" class="img-responsive" alt="VNL Advanced Flow Below 25th Driver 3-4">
                                                </a>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/vnl/">Volvo VNL</a>
                                                    
                                                    <p itemprop="description">Long haul efficiency – premium comfort.</p>
                                                    
                                                    <a href="https://www.volvotrucks.us/trucks/build/" target="" class="cta thin">Build Your VNL</a>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <a href="https://www.volvotrucks.us/trucks/vnx/" class="image-container">
                                                    <img itemprop="image" src="https://www.volvotrucks.us/-/media/vtna/images/refresh/mega-menu/vnx-1.jpg?rev=c99656fb532446faa492004a84e9c076" class="img-responsive" alt="Volvo Trucks VNX Cabin">
                                                </a>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/vnx/">Volvo VNX</a>
                                                    
                                                    <p itemprop="description">Setting the standard for heavy haul.</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <a href="https://www.volvotrucks.us/trucks/vhd/" class="image-container">
                                                    <img itemprop="image" src="https://www.volvotrucks.us/-/media/vtna/images/shared/vhd-redesign/vhd-megamenu.jpg?rev=5a0719747978464fb9bb35fcfdd4940e" class="img-responsive" alt="VHD-Megamenu">
                                                </a>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/vhd/">Volvo VHD</a>
                                                    
                                                    <p itemprop="description">Tougher made smarter.</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                

                                <div class="row">
                                    
                                    <div class="col-md-2 col-md-offset-1">
                                        <div class="product">
                                            <div>
                                                
                                                <a href="https://www.volvotrucks.us/trucks/vah/" class="image-container">
                                                    <img itemprop="image" src="https://www.volvotrucks.us/-/media/vtna/images/vah/overview/vah-300-driver-165x100.jpg?rev=c8cbf9365f7b4985ac7a53533025be7a" class="img-responsive" alt="VAH Mega Menu">
                                                </a>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/vah/">Volvo VAH</a>
                                                    
                                                    <p itemprop="description">The ultimate auto hauler.</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                            </div>
                            

                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-10 col-md-offset-1">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/trucks/powertrain/" target="">Powertrain</a></h3>
                                            
                                                <p class="description">Volvo Powertrain keeps your business moving forward.</p>
                                            </div>
                                            
                                    </div>
                                </div>
                                <!-- list the pages associated with the current group -->
                                

                                <div class="row">
                                    
                                    <div class="col-md-2 col-md-offset-1">
                                        <div class="product">
                                            <div>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/powertrain/i-torque/">I-Torque</a>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/powertrain/d13tc/">D13TC</a>
                                                    
                                                    <p itemprop="description">The engine that redefines versatility.</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/powertrain/d11/">D11</a>
                                                    
                                                    <p itemprop="description">Lightweight, heavy-duty performance</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/powertrain/d13/">D13</a>
                                                    
                                                    <p itemprop="description">Power for every application</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/powertrain/cummins-x15/">Cummins X15</a>
                                                    
                                                    <p itemprop="description">Power options for special applications</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                

                                <div class="row">
                                    
                                    <div class="col-md-2 col-md-offset-1">
                                        <div class="product">
                                            <div>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/powertrain/i-shift-transmission/">I-Shift Transmission</a>
                                                    
                                                    <p itemprop="description">Ensures the right shift at the right time</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/powertrain/natural-gas/">Natural Gas</a>
                                                    
                                                    <p itemprop="description">Factory-installed engine options</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/trucks/emissions/">Emissions</a>
                                                    
                                                    <p itemprop="description">Near-zero emissions and enhanced efficiency</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                            </div>
                            
                        </div>
                    </div>
                    
                    <div class="navigationFooterCTA row">
                        <div class="col-md-12">
                            <p>
                                Speak to a Volvo expert near you.
                                <a href="https://www.volvotrucks.us/find-a-dealer/">Find a Dealer</a>
                                
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <div class="mega-menu" id="ed51f7eed42f4bffa27bbf63f653d58d">
                    
                    <div class="row mega-menu-padding">

                        
                        <div class="col-md-2 col-md-offset-1">
                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-12">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/parts-and-services/parts/" target="">Parts</a></h3>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <ul itemscope itemtype="http://www.schema.org/siteNavigationElement" class="list-unstyled">
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/parts/genuine/">Genuine</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/parts/remanufactured/">Volvo Reman</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/parts/all-makes/">All-Makes</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/parts/partsasist/">PartsASIST</a>
                                    </li>
                                    
                                </ul>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-2 ">
                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-12">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/parts-and-services/services/" target="">Services</a></h3>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <ul itemscope itemtype="http://www.schema.org/siteNavigationElement" class="list-unstyled">
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/services/uptime-service-solutions/">Uptime Service Solutions</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/services/service-and-maintenance-intervals/">Service &amp; Maintenance Intervals</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/services/body-builder-support/">Body Builder Support</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/services/warranty/">Warranty</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/services/resources/">Resources &amp; Manuals</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/services/faqs/">FAQs</a>
                                    </li>
                                    
                                </ul>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-2 ">
                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-12">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/parts-and-services/fleets/" target="">Fleets</a></h3>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <ul itemscope itemtype="http://www.schema.org/siteNavigationElement" class="list-unstyled">
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/fleets/fleetpreferred/">FleetPreferred</a>
                                    </li>
                                    
                                </ul>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-2 ">
                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-12">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/parts-and-services/training/" target="">Training</a></h3>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <ul itemscope itemtype="http://www.schema.org/siteNavigationElement" class="list-unstyled">
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/training/driver-training/">Video Walkarounds</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/parts-and-services/training/service-tech-training/">Service Tech Training</a>
                                    </li>
                                    
                                </ul>
                                
                            </div>
                        </div>
                        
                    </div>
                    
                    <div class="navigationFooterCTA row">
                        <div class="col-md-12">
                            <p>
                                Speak to a Volvo expert near you.
                                <a href="https://www.volvotrucks.us/find-a-dealer/">Find a Dealer</a>
                                
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <div class="mega-menu" id="c4d1434423b14d73805dfc78fcfcd797">
                    
                    <div class="row mega-menu-padding">

                        
                        <div class="col-md-2 col-md-offset-1">
                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-12">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/our-difference/" target="">Our Difference</a></h3>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <ul itemscope itemtype="http://www.schema.org/siteNavigationElement" class="list-unstyled">
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/our-difference/uptime-and-connectivity/">Uptime and Connectivity</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/our-difference/safety/">Safety</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/our-difference/driver-productivity/">Driver Productivity</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/our-difference/fuel-efficiency/">Fuel Efficiency</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/our-difference/uptime-and-connectivity/fleet-management/">Fleet Management</a>
                                    </li>
                                    
                                </ul>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-2 ">
                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-12">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/innovation/" target="">Innovation</a></h3>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <ul itemscope itemtype="http://www.schema.org/siteNavigationElement" class="list-unstyled">
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/innovation/supertruck/">SuperTruck</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/innovation/electromobility/">Electromobility</a>
                                    </li>
                                    
                                </ul>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-2 ">
                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-12">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/about-volvo/our-story/" target="">Our Story</a></h3>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <ul itemscope itemtype="http://www.schema.org/siteNavigationElement" class="list-unstyled">
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/about-volvo/history/">History</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/about-volvo/facilities/">Facilities</a>
                                    </li>
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/links/megamenu/careers/">Careers</a>
                                    </li>
                                    
                                </ul>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-2 ">
                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-12">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/about-volvo/events/" target="">Events</a></h3>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <ul itemscope itemtype="http://www.schema.org/siteNavigationElement" class="list-unstyled">
                                    
                                    <li itemprop="name">
                                        <a itemprop="url" href="https://www.volvotrucks.us/about-volvo/events/act-expo/">ACT Expo</a>
                                    </li>
                                    
                                </ul>
                                
                            </div>
                        </div>
                        
                    </div>
                    
                    <div class="navigationFooterCTA row">
                        <div class="col-md-12">
                            <p>
                                Speak to a Volvo expert near you.
                                <a href="https://www.volvotrucks.us/find-a-dealer/">Find a Dealer</a>
                                
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <div class="mega-menu" id="468465c400e343c496227ff62880bb03">
                    
                    <div class="row mega-menu-padding">
                        <div class="col-md-12">

                            

                            <div class="headerNavigationList">
                                <div class="row">
                                    <div class="col-md-10 col-md-offset-1">
                                        
                                        <div class="row-container">
                                            <h3 class="title SmallTitleRegular"><a href="https://www.volvotrucks.us/news-and-stories/" target="">News &amp; Stories</a></h3>
                                            
                                                <p class="description">The Latest In Volvo Trucks</p>
                                            </div>
                                            
                                    </div>
                                </div>
                                <!-- list the pages associated with the current group -->
                                

                                <div class="row">
                                    
                                    <div class="col-md-2 col-md-offset-1">
                                        <div class="product">
                                            <div>
                                                
                                                <a href="https://www.volvotrucks.us/news-and-stories/volvo-trucks-magazine/" class="image-container">
                                                    <img itemprop="image" src="https://www.volvotrucks.us/-/media/vtna/images/refresh/mega-menu/blog.jpg?rev=f8b5084ecfc84618823b84625ed3aefe" class="img-responsive" alt="Blog">
                                                </a>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/news-and-stories/volvo-trucks-magazine/">Volvo Trucks Magazine</a>
                                                    
                                                    <p itemprop="description">Stories for our drivers and fleet managers.</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-2 ">
                                        <div class="product">
                                            <div>
                                                
                                                <a href="https://www.volvotrucks.us/news-and-stories/press-releases/" class="image-container">
                                                    <img itemprop="image" src="https://www.volvotrucks.us/-/media/vtna/images/shared/pressreleases.jpg?rev=fe206f5893464ce2a0a6c98b44787b7d" class="img-responsive" alt="Volvo Trucks Grill with Volvo Logo">
                                                </a>
                                                
                                                <div class="wrapper">
                                                    
                                                    <a itemprop="name" href="https://www.volvotrucks.us/news-and-stories/press-releases/">Press Releases</a>
                                                    
                                                    <p itemprop="description">The latest news from Volvo Trucks.</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                            </div>
                            
                        </div>
                    </div>
                    
                    <div class="navigationFooterCTA row">
                        <div class="col-md-12">
                            <p>
                                Speak to a Volvo expert near you.
                                <a href="https://www.volvotrucks.us/find-a-dealer/">Find a Dealer</a>
                                
                            </p>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    </div>

    

    <div id="configuratorImportSubNavContainer">

        
        <div class="stickyElement">
            
        </div>
    </div>
    
</header>
<script>
    window.volvo.init.push(function () {
        $('.side-menu-open').on('click', function (e) {
            e.preventDefault();
            $('.side-menu-open').hide();
            $('.side-menu-close').show();
            $('.side-nav-container').addClass('open');
            $('html').addClass('side-nav-visible');
        });
        $('.side-menu-close , .ovelay-mask').on('click', function (e) {
            e.preventDefault();
            $('.side-menu-open').show();
            $('.side-menu-close').hide();
            $('.side-nav-container').removeClass('open');
            $('html').removeClass('side-nav-visible');
        });
        $('.side-nav-accordion').accordion({
            "transitionSpeed": 400
        });
        /*//
        $('.typeahead').typeahead({
            hint: false,
            highlight: true,
            minLength: 2
        },
        window.volvo.components.searchResults.config);
        //*/
    });
    $(document).ready(function () {
        $('#search-expand').on('click', function () {
            $('.dealer-locator').toggleClass('search-bar-added');
        });

    });
</script>



<!-- Script to change "Customer Login" to "Portal " -->


    

    <div class="container main-content allow-full-width no-subnav">
        


<div class="dealer-locator">
	<input id="hoverText" value="Please unselect the selected option to click this option" hidden />
   <!-- PartsASIST Datasource Selection -->
   <div class="datasource-option" style="display:none;">
    <div class="backdrop"></div>
    <div class="col-12">
      <div class="row">
        <h3 class="MediumTitleSentence">Select a Brand</h3>
        <p>To view participating dealers near you.</p>
        <div class="brand">
          <button id="volvo" type="button">Volvo Trucks</button>
          <button id="mack" type="button">Mack Trucks</button>
          <button id="dual" type="button" style="min-width:80px;">Other</button>
        </div>
      </div>
    </div>
   </div>
   <!-- PartsASIST Registration Modal -->
   <div class="partsasist-form" style="display:none;">
    <div class="backdrop"></div>
    <div class="col-12">
      <div class="row regForm rtl-padding">
  
        <button type="button" class="btn" onclick="$.fn.resetRegistration(this);">Return to Dealer Locator</button>

        <h3 class="MediumTitleSentence"></h3>
      </div>
      <div class="row regForm">
        <div id="select-form">SELECT FORM HTML</div>
      </div>
    </div>
   </div>
   <div class="wrapper">
       <div class="mobile-main-header">
         <div class="panel-header">
               <input type="text" id="location2" placeholder="Enter City, State, or Zip Code" />
               <div class="search-container">
                  <button type="button" id="search" onclick="$.fn.setAddress2();">
                     <img src="/images/dealer-locator/volvo/search.svg"/>
                  </button>
               </div>
                <div class="filter-container">
               <button type="button" onclick="$.fn.switchSidebarPane('sidebar-filter');">
                  <div style="width:44px;">
                     <div class="icon"><img src="/images/dealer-locator/volvo/filter.svg"/></div>
                  </div>
               </button>
            </div>
               <div class="geo-container">
                  <button type="button" id="search" onclick="$.fn.setLocation();"><img src="/images/dealer-locator/volvo/location.svg"/></button>
               </div>
               
         </div>
       </div>
      <div id="map"></div>
         <div class="map-geo-container">
                  <button type="button"  id="search" onclick="$.fn.setLocation();"> <img src="/images/dealer-locator/volvo/location.svg"/></button>
               </div>
      <div class="sidebar" style="left:0px;">
         <div class="row main-header">
            <div class="panel-header">
               <input type="text" id="location" placeholder="Enter City, State, or Zip Code" />
               <div class="search-container">
                  <button type="button" id="search" onclick="$.fn.setAddress();">
                      <img src="/images/dealer-locator/volvo/search.svg"/>
                  </button>
               </div>
                <div class="filter-container">
               <button type="button" onclick="$.fn.switchSidebarPane('sidebar-filter');">
                  <div style="width:44px;">
                     <div class="icon"> <img src="/images/dealer-locator/volvo/filter.svg"/></div>
                  </div>
               </button>
            </div>
               <div class="geo-container">
                  <button type="button"  id="search" onclick="$.fn.setLocation();"> <img src="/images/dealer-locator/volvo/location.svg"/></button>
               </div>
             
            </div>
         </div>
          <div class="row legend-header">
              
             
             <div class="sidebar-legend">
                 <span id="dealer-tag">
                 <div class="dealer" id="filterDealer">
                     <div>
                     <img src="/images/dealer-locator/volvo/volvo-pin-dealer.svg" class="legend-icon" /> 
                     <span>Dealer</span>
                      </div>
                 </div>
                     </span>
                 <span id="uptime-tag">
                 <div class="uptime-dealer" id="filterUptime">
                     <div>
                     <img src="/images/dealer-locator/volvo/volvo-pin-uptime.svg" class="legend-icon" /> <span>Certified Uptime Dealer</span>
                </div>
                         </div>
                     </span>
                  <span id="electric-tag">
                 <div class="electric-dealer" id="filterElectricDealer">
                     <div>
                     <img src="/images/dealer-locator/volvo/bolt.svg" class="legend-icon" /> <span>Certified Electric Dealer</span>
                 </div>
                     </div>
                      </span>
                  <div class="mobile-dealer" id="filterDealerMobile">
                    <div>
                     <img src="/images/dealer-locator/volvo/volvo-pin-dealer.svg" class="legend-icon" /> 
                     <span>Dealer</span>
                      </div>
                 </div>
                 <div class="mobile-uptime-dealer" id="filterUptimeMobile">
                     <div>
                     <img src="/images/dealer-locator/volvo/volvo-pin-uptime.svg" class="legend-icon" /> <span>Certified Uptime</span>
                </div>
                 </div>
                 <div class="mobile-electric-dealer" id="filterElectricDealerMobile">
                    <div>
                     <img src="/images/dealer-locator/volvo/bolt.svg" class="legend-icon" /> <span>Certified Electric</span>
                 </div>
                 </div>

             </div>
          </div>
         <div class="row main-directions" style="display: none;">
            <div class="go-back-direction" style="text-align: right;">
               <button type="button" id="cancel2">Back</button>
            </div>
            <div class="panel-header from-directions">
               <input type="text" id="location" placeholder="Enter City, State, or Zip Code" />
            </div>
            <div class="panel-header to-directions" style="margin-top:5px;">
               <input type="text" id="location" placeholder="Enter City, State, or Zip Code" />
            </div>
              <div class="panel-header add-directions" onclick="$.fn.switchSidebarPane('add-directions-return', this);" data-id="">
                  <i class="fa fa-refresh"></i> Recalculate Directions
              </div>  
         </div>
         <div class="sidebar-content">
                                          <div class="go-back" style="display:none;">
                  <button type="button" class="tooltip" id="cancel">Back</button>
               </div>
             <div class="loading-overlay">
                 <div class="loading-msg">
                     <p>One moment while we gather nearby dealers</p>
                 </div>
             </div>
             <div class="waiting-overlay">
                 <p>Start finding nearby dealers by providing a location above.</p>
             </div>
         </div>
      </div>

      <a href="javascript:void(0);" class="slider-arrow hide"><i class="fa fa-angle-left"></i></a>    

       

   </div>
   <div id="sidebar-pins" style="display: none;">
      <div class="row" style="height:100%;">
         
         <div class="scroller">
             <p class="no-dealer-text" style="display: none;">No Dealers Found</p>
            <div class="nearby-pins"></div>
         </div>
      </div>
      <div class="panel-footer">Loading...</div>
   </div>
   <div id="sidebar-pin" style="display: none;">
      <div class="pin-header">
          <div class="pin-details-header">
              <img id="head-marker" class="pin-header-img" src="" />
              <div id="title"></div>
              
               
             
          </div>
         <div id="type"></div>
         <div class="button-group">
            <div id="my-dealer" style="display: none;"><i class="fa fa-star-o tooltip"><span class="tooltiptext mydealer">Your Preferred Dealer</span></i></div>
         </div>
          
       <div class="dealer-deatils-header">
           <div class="detail-website">
               <a target="_blank">
               <img src="/images/dealer-locator/volvo/Globe-4.png" />
               Website</a>
           </div>
           <div class="detail-direction">
               <a id="directions" data-id="" onclick="$.fn.switchSidebarPane('sidebar-directions', this);">
               <img src="/images/dealer-locator/volvo/GPS-2.png" />
               Directions</a>
           </div>
           <div class="detail-call">
               
           </div>
           <div class="detail-share">
               
               <button type="button" class="accordion"><img src="/images/dealer-locator/volvo/Share-2.png" /><span>SHARE</span></button>
                  <div class="accordion-panel">
                     <input type="text" id="share-link" value="" onclick="this.select();" />
                  </div>  
           </div>
           <div class="detail-email">
               
           </div>
       </div>
      </div>
      <div class="row pin-content">
         <div class="scroller">
            <div class="pin-container">
               
          
                  
                  
                  
               
               <ul class="pin-details">
                  <li>
                      <img src="/images/dealer-locator/volvo/Map.png" />
                      <div id="title2"></div><br />
                     <div id="address1">
                        <div></div>
                     </div><br />
                     <div id="address2">
                        <div></div>
                     </div>
                     <div id="city-state-zip">
                        <div></div>
                     </div>
                     <div class="controls">
                        <i class="tooltip fa fa-copy" id="clipboard-address" data-clipboard="" onclick="$.fn.copyToClipboard(this);"><span class="tooltiptext copy">Copy address</span></i>
                     </div>
                  </li>
                   <li id="hours">
                       <img src="/images/dealer-locator/volvo/Clock.png" />
                     <div></div>
                  </li>
                  <li>
                      <img src="/images/dealer-locator/volvo/Globe.png" />
                     <div id="website">No website available</div>
                     <div class="controls">
                        <i class="tooltip fa fa-external-link" id="open-website" onclick=""><span class="tooltiptext link">Open website</span></i>
                     </div>
                  </li>
                  <li id="email">
                     
                     <div></div>
                  </li>
                  
                  
                  <li id="details" class="accordion-panel"></li>
               </ul>
                  <div class="header-title header-driver-title">Driver Amenitites</div>
               <ul id="drivers">
               </ul>
               <div class="header-title header-services-title">Truck Services</div>
               <ul id="services">
               </ul>
            </div>
         </div>
      </div>
   </div>
   <div id="nearbyPinDetails" style="display: none;">
      <div class="panel-card">
         <div class="panel-container">
            <article class="teaser">
               <div class="marker-main" style="width: 15%;">
                  <img id="marker" src="" />
               </div>
               <div class="dealerPanelContainer">
                  <div class="teaser-top" onclick="$.fn.switchSidebarPane('sidebar-pin', this);" data-id="">
                     <div class="heading">
                        <p></p>
                         
                      <div class="distance"></div>
                     </div>
                     <div class="info">
                        <div class="hours"></div>
                     </div>
                      <div class="left">
                        <div class="address"></div>
                        <div class="city"></div>
                        <div class="phone"></div>
                     </div>
                  </div>
                  <div class="teaser-bottom">
                     
                     <div class="right">
                        <div class="website">
                           <a href="" target="_blank" rel="noopener"></a>
                        </div>
                     </div>
                       <div class="right">
                        <div class="direction">
                           <a href="" id="direction" onclick="$.fn.switchSidebarPane('sidebar-direction-list', this);return false;"></a>
                        </div>
                     </div>
                       <div class="right">
                        <div class="call">
                           
                        </div>
                     </div>
                      <div class="right">
                        <div class="more" onclick="$.fn.switchSidebarPane('sidebar-pin', this);">
                           <a>More</a>
                        </div>
                     </div>
                  </div>
                  <div class="teaser-services">
                  </div>
               </div>
            </article>
         </div>
      </div>
   </div>
   <div id="sidebar-filter" style="display: none;">
      <div class="row" style="padding-top: 25px;">
         <div class="panel-card result-item">
            <div class="panel-container">
               <span class="header-title">Filter By Distance</span>
               <ul>
                  <li>
                     <div>
                        <input name=range-filter class=range-filter type=range id=range value=75 list=steplist max=100 min=25 step=25 onchange="$.fn.radiusChange();" />
                        <datalist id=steplist class=sliderticks>
                           <option>25</option>
                           <option>50</option>
                           <option>75</option>
                           <option>100</option>
                        </datalist>
                     </div>
                  </li>
               </ul>
            </div>
         </div>
         <div class="panel-card result-item">
            <div class="panel-container">
               <span class="header-title">Filter By Service</span>
               <ul id="filter-options">
                  
                  <li>
                     <label for=all>All Dealers
                     <input name=type-filter type=checkbox id=all value="All Dealers" checked=checked/>
                     <span class="checkmark"></span>
                     </label>
                  </li>
                  <li>
                     <label for=rental-leasing>Rental &amp; Leasing
                     <input name=type-filter type=checkbox id=rental-leasing value=Leasing />
                     <span class="checkmark"></span>
                     </label>
                  </li>
                  
               </ul>
            </div>
         </div>
      </div>
   </div>
    <div id="sidebar-direction-list" style="display: none;">
      <div class="row">
          <div class="scroller">
            <div class="directions-panel">
                <div class="pin-actions directions">
                    <button type="button" id="gmaps-link"><img src="/images/dealer-locator/volvo/Google-Maps-Old.svg" /><span>Open in<br>Google Maps</span></button>
                    <button type="button" id="print"><img src="/images/dealer-locator/volvo/Print.svg" /><span>Print</span></button>
                    <button type="button" id="add-directions" onclick="$.fn.switchSidebarPane('sidebar-select-pins');"><img src="/images/dealer-locator/volvo/MacOS-Maximize.svg" /></i><span>Modify Dealer<br>Waypoints</span></button>
                </div>
                <div id="directions-container"></div>
            </div>
          </div>
      </div>
    
    </div>
    <div id="sidebar-directions" style="display: none;">
        
      <div class="row">
          <div class="scroller">
            <div class="directions-panel">
                <div class="pin-actions directions">
                     <button type="button" id="gmaps-link"><img src="/images/dealer-locator/volvo/Google-Maps-Old.svg" /><span>Open in<br>Google Maps</span></button>
                    <button type="button" id="print"><img src="/images/dealer-locator/volvo/Print.svg" /><span>Print</span></button>
                    <button type="button" id="add-directions" onclick="$.fn.switchSidebarPane('sidebar-select-pins');"><img src="/images/dealer-locator/volvo/MacOS-Maximize.svg" /></i><span>Modify Dealer<br>Waypoints</span></button>
                </div>
                <div id="directions-container"></div>
            </div>
          </div>
      </div>
    </div>
    <div id="sidebar-select-pins" style="display: none;">
      <div class="row">
        <span class="header-title">Advanced Routing</span>
        <p>Click any <i><span id="filter"></span> Dealer</i> on the map to add it to your route. When done, click <strong>Calculate Route</strong> below.</p>
        <p>
              <div class="go-back-pin">
                <button type="button">Calculate Route</button>
                <button type="button">Back to Directions</button>
              </div>   
        </p>
        <div class="scroller">
          <div class="nearby-select"></div>
        </div>
      </div>
    </div>
    <div id="sidebar-select-pin" style="display: none;">
      <div class="panel-card">
        <div class="panel-container">
          <article class="teaser">

              <div style="width: 15%;">
                <i class="fa fa-close tooltip" onclick="$.fn.removeWaypoint(this)" data-id=""><span class="tooltiptext removepin">Remove from route</span></i>
              </div>
              <div style="width: 80%;">
                <div class="teaser-top">
                    <div class="heading">
                      <p></p>
                    </div>
                    <div class="info">
                      <div class="hours"></div>
                      <div class="distance"></div>
                    </div>
                </div>
                <div class="teaser-bottom">
                    <div class="left">
                      <div class="address"></div>
                      <div class="city"></div>
                      <div class="phone"></div>
                    </div>
                    <div class="right">
                      <div class="website">
                        <a href="" target="_blank" rel="noopener"></a>
                      </div>
                    </div>
                </div>
                <div class="teaser-services">
                  
                </div>
              </div>
          </article>
        </div>
      </div>
    </div>
   <div id="locator-snackbar"></div>

   <script id="eloquaForm" type="text/template">
    <div class="template">
        
    </div>
   </script>

</div>

    </div>
    
    <div class="ovelay-mask"></div>

    

   </form>
 `;

  let theForm = block;
  if (!theForm) {
    theForm = document.Form1;
  }

  function __doPostBack(eventTarget, eventArgument) {
    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
      theForm.__EVENTTARGET.value = eventTarget;
      theForm.__EVENTARGUMENT.value = eventArgument;
      theForm.submit();
    }
  }
}
