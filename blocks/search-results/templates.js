const templates = [
  `
  <script type="text/x-template" id="result-template">
    <div class="card-searchstudio-js-custom" :class="{'card-searchstudio-js-grid-layout': isGridLayout, 'has-thumbnail': thumbnail !== ''}">     <div class="card-searchstudio-jsClass">
        <div class="card-searchstudio-js-body p-0">
            <span class="badge" v-if="ribbon" v-html="ribbon" />
            <div class="card-searchstudio-js-title">
                <a class="stretched-link" v-if="url" :href="url" @click="navigate" v-html="title ? title : result['resulttitle_t']" />
                <span v-else v-html="title ? title : result['resulttitle_t']" />
            </div>
            <span class="card-searchstudio-js-path" v-if="paths" v-html="paths" />
            <span class="star elevated" v-if="promoted"> </span>
            <div class="thumbnail" v-if="thumbnail"><span><img :src="thumbnail"></span></div>

            <div class="card-searchstudio-js-body p-0" v-if="date || snippet">
                <div v-if="date"><div class="card-searchstudio-js-text"><span v-html="date" /></div></div>
                <div v-if="snippet"><div class="card-searchstudio-js-text"><span v-html="snippet" /></div></div> </div>
                <div class="card-searchstudio-js-body p-0">
                  <div v-for="(value, propertyName) in result" :key="propertyName">
                    <!-- Check if the value is "this_field" -->
                    <div v-if="value !== result['resulttitle_t']">
                      <div v-if="displayProperty(value, propertyName)">
                        <div class="card-searchstudio-js-text" :class="propertyName">
                          <span class="image" v-if="isImage(value)">
                            <img :src="value" />
                          </span>
                          <span
                            :class="valueClass(value)"
                            v-html="extractedValue(propertyName, value)"
                            v-else
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </script>
  `,
  `
  <script type="text/x-template" id="searchFeedback-template">
    <div class="search-feedback-filters-custom align-items-center333"
          :class="{ active: hasResults }"
          v-if="searchStore.searchFired && hasResults">
        <div class="sf-filter-info">
          <span v-if="searchStore.searchFired">
            Showing <strong>{{ searchStore.startDoc + 1 }} - {{ searchStore.endDoc }} </strong> of <strong>{{ searchStore.totalResults }}</strong> results
            <span v-if="searchStore.studioConnector.defaultQuery != searchStore.searchTerm && searchStore.searchTerm != ''">
              for
              <strong>"{{ searchStore.searchTerm }}"</strong>
            </span>
          </span>
        </div>
    </div>
  </script>
  `,
  `
    <script type="text/x-template" id="leave-feedback-template">
    <div id="sf-widget-custom" class="sf-main">
    <a href="#" class="sf-open-feedback" @click.prevent="toggleFeedback" >
    [ - ] Search Feedback
    </a>
    <div class="sf-modal-content" v-bind:class="[feedback_open ? 'sf-open' : 'sf-close']">
    <div class="sf-modal-header">
    <h5 class="sf-title">Search Feedback</h5>
    <button class="sf-modal-close" v-on:click.prevent="toggleFeedback"><span><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJDYXBhXzEiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDM4Ni42NjcgMzg2LjY2NyIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCAzODYuNjY3IDM4Ni42NjciIHdpZHRoPSI1MTIiIGNsYXNzPSIiPjxnPjxwYXRoIGQ9Im0zODYuNjY3IDQ1LjU2NC00NS41NjQtNDUuNTY0LTE0Ny43NyAxNDcuNzY5LTE0Ny43NjktMTQ3Ljc2OS00NS41NjQgNDUuNTY0IDE0Ny43NjkgMTQ3Ljc2OS0xNDcuNzY5IDE0Ny43NyA0NS41NjQgNDUuNTY0IDE0Ny43NjktMTQ3Ljc2OSAxNDcuNzY5IDE0Ny43NjkgNDUuNTY0LTQ1LjU2NC0xNDcuNzY4LTE0Ny43N3oiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgc3R5bGU9ImZpbGw6I0ZDNjczMCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiPjwvcGF0aD48L2c+IDwvc3ZnPg==" /></span></button>
    </div>
    <form id="sf-rating-form">
    <div class="sf-modal-body ">
    <label>How would you rate your search experience?</label>
    <div class="form-group">
    <div class="sf-rate-experience">
      <div class="sf-custom-control" v-for='index in 11' :key='index'>
        <input type="radio" v-bind:id="'sf-rate-'+(index-1)" name="sf-rating" class="sf-custom-control-input" v-bind:value="index-1" v-model.number="sf.rating" v-on:change="validateFeedback">
        <label :for="'sf-rate-'+(index-1)" class="sf-custom-control-label">{{index-1}}</label>
      </div>
    </div>
    <div class="sf-rate">
      <p><small>0 = Very Dissatisfied</small></p>
      <p><small>10 = Very Satisfied</small></p>
    </div>
    <div class="sf-error-rating alert alert-danger" v-bind:class="[errors.rating ? 'sf-show' : 'sf-hide']">Please Rate your
    experience.</div>
    </div>
    <div class="sf-comments sf-form-group">
      <label for="sf-comments">Comments <small>({{computeCommentsLimit}} characters remaining)</small></label>
      <textarea :maxlength="max_length" class="sf-form-control" id="sf-comments" placeholder="Enter any comments relating to your search experience" v-model="sf.comments"></textarea>
    </div>
    <div class="sf-email sf-form-group">
      <label for="sf-email">Email</label>
      <input class="sf-form-control" type="email" id="sf-email" placeholder="Enter an email address if you want a response" v-model="sf.email" v-on:input="validateFeedback">
      <div class="sf-error-email alert alert-danger" v-bind:class="[errors.email ? 'sf-show' : 'sf-hide']" >Please enter a valid email id</div>
    </div>
    </div>
    <div class="sf-modal-footer">
    <a href="http://searchstax.com/" target="_blank" class="left">
    <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMzEuNSAzOS44IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMzEuNSAzOS44OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZDNjczMDt9Cgkuc3Qxe2ZpbGw6IzMzNDc1QTt9Cgkuc3Qye2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fQo8L3N0eWxlPgo8Zz4KCTxnIGlkPSJsb2dvX3g1Rl9jb2xvcl8xXyI+CgkJPGc+CgkJCTxnPgoJCQkJPGcgaWQ9IlhNTElEXzhfIj4KCQkJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMC4zLDMxLjhMMS44LDMxYzAuMS0wLjEsMC4zLTAuMSwwLjUsMGw3LjQsNC4yYzAuMSwwLjEsMC4zLDAuMSwwLjUsMGw3LjMtNC4yYzAuMi0wLjEsMC4zLTAuMSwwLjUsMAoJCQkJCQlsMS40LDAuOWMwLjMsMC4yLDAuMywwLjYsMCwwLjhsLTkuMiw1LjRjLTAuMSwwLjEtMC4zLDAuMS0wLjUsMGwtOS40LTUuNEMwLDMyLjUsMCwzMiwwLjMsMzEuOHoiLz4KCQkJCTwvZz4KCQkJCTxnIGlkPSJYTUxJRF83XyI+CgkJCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAuMywyNi41bDEuNi0wLjljMC4xLTAuMSwwLjMtMC4xLDAuNSwwbDcuMiw0LjJjMC4xLDAuMSwwLjMsMC4xLDAuNSwwbDcuMy00LjJjMC4xLTAuMSwwLjItMC4yLDAuMi0wLjQKCQkJCQkJVjI0YzAtMC40LTAuNC0wLjYtMC43LTAuNGwtNi43LDMuOWMtMC4xLDAuMS0wLjMsMC4xLTAuNSwwTDAuMiwyMmMtMC4zLTAuMi0wLjMtMC42LDAtMC44bDkuMy01LjVjMC4xLTAuMSwwLjMtMC4xLDAuNSwwCgkJCQkJCWw1LjMsM2MwLjMsMC4yLDAuMywwLjYsMCwwLjhsLTEuNCwwLjljLTAuMiwwLjEtMC4zLDAuMS0wLjUsMGwtMy40LTJjLTAuMi0wLjEtMC4zLTAuMS0wLjUsMGwtNC40LDIuN2MtMC4zLDAuMi0wLjMsMC42LDAsMC44CgkJCQkJCWw0LjQsMi42YzAuMSwwLjEsMC4zLDAuMSwwLjUsMGw3LjMtNC4yYzAuMS0wLjEsMC4zLTAuMSwwLjUsMGwyLDEuMWMwLjIsMC4xLDAuMiwwLjIsMC4yLDAuNHY0LjdjMCwwLjItMC4xLDAuMy0wLjIsMC40CgkJCQkJCWwtOS42LDUuN2MtMC4xLDAuMS0wLjMsMC4xLTAuNSwwbC05LjQtNS41Qy0wLjEsMjcuMi0wLjEsMjYuNywwLjMsMjYuNXoiLz4KCQkJCTwvZz4KCQkJPC9nPgoJCQk8ZyBpZD0iRElOX3g1Rl9OZXh0X3g1Rl9MVF94NUZfUHJvX3g1Rl9MaWdodF94MEFfXzFfIj4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNC45LDMxLjNjLTAuMS0wLjEtMC4xLTAuMiwwLTAuMmwwLjQtMC41YzAuMS0wLjEsMC4yLTAuMSwwLjIsMGMwLjcsMC42LDEuOSwxLjEsMy4yLDEuMQoJCQkJCWMxLjgsMCwyLjgtMC45LDIuOC0yLjJjMC0xLjEtMC42LTEuOS0yLjYtMi4xbC0wLjUtMC4xYy0yLjEtMC4zLTMuMi0xLjMtMy4yLTIuOWMwLTEuOSwxLjQtMy4xLDMuNS0zLjFjMS4yLDAsMi40LDAuNCwzLjEsMC45CgkJCQkJYzAuMSwwLDAuMSwwLjEsMCwwLjJsLTAuMywwLjVjLTAuMSwwLjEtMC4xLDAuMS0wLjIsMGMtMC45LTAuNS0xLjctMC44LTIuNy0wLjhjLTEuNiwwLTIuNSwwLjktMi41LDIuMWMwLDEuMSwwLjcsMS44LDIuNiwyLjEKCQkJCQlsMC41LDAuMWMyLjIsMC4zLDMuMiwxLjMsMy4yLDNjMCwxLjktMS4zLDMuMi0zLjksMy4yQzI3LjEsMzIuNiwyNS43LDMyLDI0LjksMzEuM3oiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNi42LDIxLjZjMC0wLjEsMC4xLTAuMiwwLjItMC4yaDYuM2MwLjEsMCwwLjIsMC4xLDAuMiwwLjJ2MC42YzAsMC4xLTAuMSwwLjItMC4yLDAuMmgtNQoJCQkJCWMtMC4zLDAtMC42LDAuMy0wLjYsMC42djNjMCwwLjMsMC4zLDAuNiwwLjYsMC42aDQuMmMwLjEsMCwwLjIsMC4xLDAuMiwwLjJ2MC42YzAsMC4xLTAuMSwwLjItMC4yLDAuMmgtNC4yCgkJCQkJYy0wLjMsMC0wLjYsMC4zLTAuNiwwLjZWMzFjMCwwLjMsMC4zLDAuNiwwLjYsMC42aDVjMC4xLDAsMC4yLDAuMSwwLjIsMC4ydjAuNmMwLDAuMS0wLjEsMC4yLTAuMiwwLjJoLTYuMwoJCQkJCWMtMC4xLDAtMC4yLTAuMS0wLjItMC4yVjIxLjZ6Ii8+CgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTAuMSwyMS42YzAtMC4xLDAuMS0wLjIsMC4yLTAuMmgwLjZjMC4xLDAsMC4yLDAuMSwwLjIsMC4ybDMuOCwxMC43YzAsMC4xLDAsMC4yLTAuMSwwLjJoLTAuNwoJCQkJCWMtMC4xLDAtMC4yLDAtMC4yLTAuMkw1MywyOS45Yy0wLjEtMC4yLTAuMi0wLjMtMC40LTAuM2gtNC4xYy0wLjIsMC0wLjQsMC4xLTAuNCwwLjNsLTAuOSwyLjRjMCwwLjEtMC4xLDAuMi0wLjIsMC4yaC0wLjYKCQkJCQljLTAuMSwwLTAuMS0wLjEtMC4xLTAuMkw1MC4xLDIxLjZ6IE01MS45LDI4LjdjMC4zLDAsMC42LTAuMywwLjQtMC42TDUwLjUsMjNsMCwwbC0xLjgsNWMtMC4xLDAuMywwLjEsMC42LDAuNCwwLjZoMi44VjI4Ljd6IgoJCQkJCS8+CgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjUsMzIuNGMtMC4xLDAtMC4xLDAtMC4yLTAuMWwtMi4zLTQuOGgtMC4ySDYwYy0wLjMsMC0wLjYsMC4zLTAuNiwwLjZ2NC4yYzAsMC4xLTAuMSwwLjItMC4yLDAuMmgtMC42CgkJCQkJYy0wLjEsMC0wLjItMC4xLTAuMi0wLjJWMjEuNmMwLTAuMSwwLjEtMC4yLDAuMi0wLjJoMy43YzIuMSwwLDMuNCwxLjIsMy40LDNjMCwxLjMtMC42LDIuMy0xLjgsMi44Yy0wLjMsMC4xLTAuNCwwLjQtMC4yLDAuNgoJCQkJCWwyLjEsNC40YzAuMSwwLjEsMCwwLjItMC4xLDAuMkg2NUw2NSwzMi40eiBNNjQuOCwyNC41YzAtMS40LTAuOS0yLjItMi40LTIuMkg2MGMtMC4zLDAtMC42LDAuMy0wLjYsMC42djMuMgoJCQkJCWMwLDAuMywwLjMsMC42LDAuNiwwLjZoMi4zQzYzLjksMjYuNiw2NC44LDI1LjksNjQuOCwyNC41eiIvPgoJCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTY5LjYsMjYuOWMwLTAuOCwwLTEuNSwwLjEtMS45YzAuMi0yLjMsMi4zLTQuMSw0LjYtMy42YzEuMSwwLjIsMS45LDAuOSwyLjQsMS45YzAsMC4xLDAsMC4yLDAsMC4yCgkJCQkJbC0wLjUsMC4zYy0wLjEsMC0wLjIsMC0wLjItMC4xYy0wLjUtMC45LTEuMy0xLjYtMi41LTEuNmMtMS4zLDAtMi4yLDAuNi0yLjYsMS44Yy0wLjEsMC40LTAuMiwxLjEtMC4yLDNjMCwxLjgsMC4xLDIuNSwwLjIsMwoJCQkJCWMwLjQsMS4yLDEuMiwxLjgsMi42LDEuOGMxLjIsMCwyLTAuNiwyLjUtMS42YzAtMC4xLDAuMS0wLjEsMC4yLTAuMWwwLjUsMC4zYzAuMSwwLDAuMSwwLjEsMCwwLjJjLTAuNiwxLjMtMS44LDItMy4zLDIKCQkJCQljLTEuNywwLTIuOS0wLjgtMy41LTIuNUM2OS43LDI5LjYsNjkuNiwyOC44LDY5LjYsMjYuOXoiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04MC42LDIxLjZjMC0wLjEsMC4xLTAuMiwwLjItMC4yaDAuNmMwLjEsMCwwLjIsMC4xLDAuMiwwLjJ2NC4yYzAsMC4zLDAuMywwLjYsMC42LDAuNmg0LjUKCQkJCQljMC4zLDAsMC42LTAuMywwLjYtMC42di00LjJjMC0wLjEsMC4xLTAuMiwwLjItMC4yaDAuNmMwLjEsMCwwLjIsMC4xLDAuMiwwLjJ2MTAuN2MwLDAuMS0wLjEsMC4yLTAuMiwwLjJoLTAuNgoJCQkJCWMtMC4xLDAtMC4yLTAuMS0wLjItMC4ydi00LjRjMC0wLjMtMC4zLTAuNi0wLjYtMC42aC00LjVjLTAuMywwLTAuNiwwLjMtMC42LDAuNnY0LjRjMCwwLjEtMC4xLDAuMi0wLjIsMC4yaC0wLjYKCQkJCQljLTAuMSwwLTAuMi0wLjEtMC4yLTAuMlYyMS42TDgwLjYsMjEuNnoiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05Mi4zLDMxLjNjLTAuMS0wLjEtMC4xLTAuMiwwLTAuMmwwLjQtMC41YzAuMS0wLjEsMC4yLTAuMSwwLjIsMGMwLjcsMC42LDEuOSwxLjEsMy4yLDEuMQoJCQkJCWMxLjgsMCwyLjgtMC45LDIuOC0yLjJjMC0xLjEtMC42LTEuOS0yLjYtMi4xbC0wLjUtMC4xYy0yLjEtMC4zLTMuMi0xLjMtMy4yLTIuOWMwLTEuOSwxLjQtMy4xLDMuNS0zLjFjMS4yLDAsMi40LDAuNCwzLjEsMC45CgkJCQkJYzAuMSwwLDAuMSwwLjEsMCwwLjJsLTAuMywwLjVjLTAuMSwwLjEtMC4xLDAuMS0wLjIsMGMtMC45LTAuNS0xLjctMC44LTIuNy0wLjhjLTEuNiwwLTIuNSwwLjktMi41LDIuMWMwLDEuMSwwLjcsMS44LDIuNiwyLjEKCQkJCQlsMC41LDAuMWMyLjIsMC4zLDMuMiwxLjMsMy4yLDNjMCwxLjktMS4zLDMuMi0zLjksMy4yQzk0LjUsMzIuNiw5MywzMiw5Mi4zLDMxLjN6Ii8+CgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTA2LjIsMzIuNGMtMC4xLDAtMC4yLTAuMS0wLjItMC4ydi05LjRjMC0wLjMtMC4zLTAuNi0wLjYtMC42aC0yLjdjLTAuMSwwLTAuMi0wLjEtMC4yLTAuMnYtMC42CgkJCQkJYzAtMC4xLDAuMS0wLjIsMC4yLTAuMmg3LjRjMC4xLDAsMC4yLDAuMSwwLjIsMC4yVjIyYzAsMC4xLTAuMSwwLjItMC4yLDAuMmgtMi43Yy0wLjMsMC0wLjYsMC4zLTAuNiwwLjZ2OS40CgkJCQkJYzAsMC4xLTAuMSwwLjItMC4yLDAuMkgxMDYuMkwxMDYuMiwzMi40eiIvPgoJCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTExNS41LDIxLjZjMC0wLjEsMC4xLTAuMiwwLjItMC4yaDAuNmMwLjEsMCwwLjIsMC4xLDAuMiwwLjJsMy44LDEwLjdjMCwwLjEsMCwwLjItMC4xLDAuMmgtMC42CgkJCQkJYy0wLjEsMC0wLjIsMC0wLjItMC4ybC0wLjktMi40Yy0wLjEtMC4yLTAuMi0wLjMtMC40LTAuM0gxMTRjLTAuMiwwLTAuNCwwLjEtMC40LDAuM2wtMC45LDIuNGMwLDAuMS0wLjEsMC4yLTAuMiwwLjJoLTAuNgoJCQkJCWMtMC4xLDAtMC4xLTAuMS0wLjEtMC4yTDExNS41LDIxLjZ6IE0xMTcuNCwyOC43YzAuMywwLDAuNi0wLjMsMC40LTAuNkwxMTYsMjNsMCwwbC0xLjgsNS4xYy0wLjEsMC4zLDAuMSwwLjYsMC40LDAuNkgxMTcuNHoiCgkJCQkJLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMjkuOSwzMi40Yy0wLjEsMC0wLjIsMC0wLjItMC4xbC0yLjgtNC43bDAsMGwtMi44LDQuN2MwLDAuMS0wLjEsMC4xLTAuMiwwLjFoLTAuNwoJCQkJCWMtMC4xLDAtMC4xLTAuMS0wLjEtMC4ybDMuMi01LjNjMC4xLTAuMiwwLjEtMC4zLDAtMC41bC0yLjktNC44Yy0wLjEtMC4xLDAtMC4yLDAuMS0wLjJoMC43YzAuMSwwLDAuMiwwLDAuMiwwLjFsMi41LDQuMmwwLDAKCQkJCQlsMi41LTQuMmMwLjEtMC4xLDAuMS0wLjEsMC4yLTAuMWgwLjdjMC4xLDAsMC4xLDAuMSwwLjEsMC4ybC0yLjksNC44Yy0wLjEsMC4yLTAuMSwwLjMsMCwwLjVsMy4yLDUuM2MwLDAuMSwwLDAuMi0wLjEsMC4yCgkJCQkJSDEyOS45TDEyOS45LDMyLjR6Ii8+CgkJCTwvZz4KCQk8L2c+Cgk8L2c+Cgk8ZyBjbGFzcz0ic3QyIj4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMS40LDIuMUMyLDIsMi42LDEuOSwzLjUsMS45YzEsMCwxLjgsMC4yLDIuMywwLjdjMC40LDAuNCwwLjcsMSwwLjcsMS43QzYuNCw1LDYuMiw1LjYsNS44LDYKCQkJQzUuMyw2LjYsNC40LDYuOSwzLjMsNi45Yy0wLjMsMC0wLjYsMC0wLjgtMC4xVjEwaC0xVjIuMXogTTIuNSw2QzIuNyw2LDMsNiwzLjQsNmMxLjMsMCwyLTAuNiwyLTEuN2MwLTEuMS0wLjgtMS42LTEuOS0xLjYKCQkJYy0wLjUsMC0wLjgsMC0xLDAuMVY2eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMi44LDcuMWMwLDIuMS0xLjUsMy4xLTIuOSwzLjFjLTEuNiwwLTIuOC0xLjItMi44LTNjMC0xLjksMS4zLTMuMSwyLjktMy4xQzExLjYsNC4xLDEyLjgsNS4zLDEyLjgsNy4xegoJCQkgTTguMSw3LjJjMCwxLjMsMC43LDIuMiwxLjgsMi4yYzEsMCwxLjgtMC45LDEuOC0yLjNjMC0xLTAuNS0yLjItMS43LTIuMkM4LjcsNC45LDguMSw2LDguMSw3LjJ6Ii8+CgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LjQsNC4ybDAuOCwzYzAuMiwwLjYsMC4zLDEuMiwwLjQsMS44aDBjMC4xLTAuNiwwLjMtMS4yLDAuNS0xLjhsMC45LTNIMThsMC45LDIuOQoJCQljMC4yLDAuNywwLjQsMS4zLDAuNSwxLjloMGMwLjEtMC42LDAuMy0xLjIsMC40LTEuOWwwLjgtMi45aDFMMTkuOSwxMGgtMWwtMC45LTIuOGMtMC4yLTAuNi0wLjQtMS4yLTAuNS0xLjloMAoJCQljLTAuMSwwLjctMC4zLDEuMy0wLjUsMS45TDE2LjEsMTBoLTFsLTEuOC01LjhIMTQuNHoiLz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjMuMyw3LjNjMCwxLjQsMC45LDIsMiwyYzAuOCwwLDEuMi0wLjEsMS42LTAuM2wwLjIsMC44Yy0wLjQsMC4yLTEsMC40LTEuOSwwLjRjLTEuOCwwLTIuOS0xLjItMi45LTIuOQoJCQlzMS0zLjEsMi43LTMuMWMxLjksMCwyLjQsMS43LDIuNCwyLjdjMCwwLjIsMCwwLjQsMCwwLjVIMjMuM3ogTTI2LjQsNi42YzAtMC43LTAuMy0xLjctMS41LTEuN2MtMS4xLDAtMS41LDEtMS42LDEuN0gyNi40eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOC43LDZjMC0wLjcsMC0xLjMsMC0xLjhoMC45bDAsMS4xaDBjMC4zLTAuOCwwLjktMS4zLDEuNi0xLjNjMC4xLDAsMC4yLDAsMC4zLDB2MWMtMC4xLDAtMC4yLDAtMC40LDAKCQkJYy0wLjcsMC0xLjMsMC42LTEuNCwxLjRjMCwwLjEsMCwwLjMsMCwwLjVWMTBoLTFWNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzMuMSw3LjNjMCwxLjQsMC45LDIsMiwyYzAuOCwwLDEuMi0wLjEsMS42LTAuM2wwLjIsMC44Yy0wLjQsMC4yLTEsMC40LTEuOSwwLjRjLTEuOCwwLTIuOS0xLjItMi45LTIuOQoJCQlzMS0zLjEsMi43LTMuMWMxLjksMCwyLjQsMS43LDIuNCwyLjdjMCwwLjIsMCwwLjQsMCwwLjVIMzMuMXogTTM2LjIsNi42YzAtMC43LTAuMy0xLjctMS41LTEuN2MtMS4xLDAtMS41LDEtMS42LDEuN0gzNi4yeiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00My42LDEuNXY3YzAsMC41LDAsMS4xLDAsMS41aC0wLjlsMC0xaDBjLTAuMywwLjYtMSwxLjEtMiwxLjFjLTEuNCwwLTIuNS0xLjItMi41LTNjMC0xLjksMS4yLTMuMSwyLjYtMy4xCgkJCWMwLjksMCwxLjUsMC40LDEuOCwwLjloMFYxLjVINDMuNnogTTQyLjUsNi42YzAtMC4xLDAtMC4zLDAtMC40Yy0wLjItMC43LTAuNy0xLjItMS41LTEuMmMtMS4xLDAtMS43LDEtMS43LDIuMgoJCQljMCwxLjIsMC42LDIuMSwxLjcsMi4xYzAuNywwLDEuNC0wLjUsMS41LTEuM2MwLTAuMSwwLTAuMywwLTAuNVY2LjZ6Ii8+CgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTQ3LjgsMTBjMC0wLjQsMC0xLDAtMS41di03aDF2My42aDBjMC40LTAuNiwxLTEuMSwyLTEuMWMxLjQsMCwyLjUsMS4yLDIuNCwzYzAsMi4xLTEuMywzLjEtMi42LDMuMQoJCQljLTAuOCwwLTEuNS0wLjMtMS45LTEuMWgwbDAsMUg0Ny44eiBNNDguOSw3LjdjMCwwLjEsMCwwLjMsMCwwLjRjMC4yLDAuNywwLjgsMS4yLDEuNiwxLjJjMS4xLDAsMS44LTAuOSwxLjgtMi4yCgkJCWMwLTEuMi0wLjYtMi4yLTEuNy0yLjJjLTAuNywwLTEuNCwwLjUtMS42LDEuM2MwLDAuMS0wLjEsMC4zLTAuMSwwLjRWNy43eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01NSw0LjJsMS4zLDMuNGMwLjEsMC40LDAuMywwLjgsMC40LDEuMmgwYzAuMS0wLjMsMC4yLTAuOCwwLjQtMS4ybDEuMi0zLjRoMS4xbC0xLjYsNC4xYy0wLjgsMi0xLjMsMy0yLDMuNgoJCQljLTAuNSwwLjUtMSwwLjYtMS4zLDAuN2wtMC4zLTAuOWMwLjMtMC4xLDAuNi0wLjMsMC45LTAuNWMwLjMtMC4yLDAuNi0wLjYsMC45LTEuMkM1NiwxMCw1Niw5LjksNTYsOS45YzAtMC4xLDAtMC4xLTAuMS0wLjMKCQkJbC0yLjEtNS4zSDU1eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MC4zLDUuMmMwLTAuNCwwLjMtMC44LDAuNy0wLjhjMC40LDAsMC43LDAuMywwLjcsMC44YzAsMC40LTAuMywwLjctMC43LDAuN0M2MC42LDUuOSw2MC4zLDUuNiw2MC4zLDUuMnoKCQkJIE02MC4zLDkuNGMwLTAuNCwwLjMtMC44LDAuNy0wLjhjMC40LDAsMC43LDAuMywwLjcsMC44YzAsMC40LTAuMywwLjctMC43LDAuN0M2MC42LDEwLjIsNjAuMyw5LjksNjAuMyw5LjR6Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==" class="sf-foot-logo"></a>
    <button class="sf-btn sf-btn-primary js-send-feedback" v-on:click.prevent="submitFeedback" v-if="!submitted" type="button">Send</button>
    <span class="sf-btn sf-btn-sent sf-btn-success" v-else>&check; Sent</span>
    </div>
    </form>
    </div>
    </div>
  </script>
  `,

  `
  <script type="text/x-template" id="searchOptionSection-template">
    <div class="ml-auto sf-filter-actions-custom">
    <div v-if="searchStore.searchFired && hasResults">
    <div class="d-flex flex-wrap justify-content-end">
      <!-- <div class="view-card-searchstudio-js-style mr-3" -->
            <!-- v-if="searchStore.viewDisplay == 'multi'"> -->
        <!-- View Style -->
        <!-- <a href="#" -->
            <!-- :class="[searchStore.layoutGrid ? 'active' : '']" -->
            <!-- @click.prevent="layoutStyle"> -->
          <!-- <span class="icon-grid" /> -->
          <!-- <span class="icon-list" /> -->
        <!-- </a> -->
      <!-- </div> -->
      <div class="form-inline justify-content-end"
            v-if="hasMostRecent">
        <label class="ml-4 mr-2"
                for="sort-by">Sort By</label>
        <select class="custom-select-searchstudio-js"
                id="sort-by"
                v-model="searchStore.sort_method.selected"
                @change="SearchHelper.search">
          <option v-for="option in searchStore.sort_method.options"
                  :value="option.key"
                  :key="option.key">
            {{ option.value }}
          </option>
        </select>
      </div>
    </div>
    </div>
    </div>
  </script>
  `,

  `
  <script type="text/x-template" id="search-template">
    <div class="input-container-custom">
    <div class="sf-header-searchstudio-js mb-5">
    <div class="">
      <div class="sf-form">
        <div class="form-group">
          <vue-autosuggest v-if="autoSuggest"
                          class="form-control-suggest"
                          :class="{'ignore-branding': storeState.studioConfig.hideBranding}"
                          :value="storeState.searchTerm"
                          :suggestions="storeState.searchSuggestions"
                          :get-suggestion-value="getSuggestionValue"
                          @input="onSuggestionInputChange"
                          :limit="10"
                          @keyup.enter.prevent="onSuggestionClick"
                          :input-props="{ id: 'searchTerm', placeholder: 'Search For...', autofocus: true }">                <template slot-scope="{ suggestion }">
              <div v-html="suggestion.item" />
            </template>
          </vue-autosuggest>
          <input v-if="!autoSuggest"
                class="form-control form-control-lg"
                :class="{'ignore-branding': storeState.studioConfig.hideBranding}"
                type="text"
                id="searchTerm"
                :value="storeState.searchTerm"
                @change="searchWithNoAutoSuggest"
                @keyup.enter.prevent="searchWithNoAutoSuggest"
                @keydown="resetSearch"
                placeholder="Search"
                autofocus>
        <span v-if="!storeState.loading">
            <button type="button"
                    class="btn text-primary search-close-button"
                    @click="onSearchIconClick"
                    v-if="searchTerm === storeState.searchTerm && searchTerm !== ''">
              <span class="fa fa-search search-icon" />
            </button>
            <button type="submit"
                    class="btn text-primary search-close-button"
                    @click="onSearchIconClick"
                    v-else>
              <span class="fa fa-search search-icon" />
            </button>
          </span>
          <div class="loader"
              v-if="storeState.loading">
            <div class="spinner-border">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    </div>
  </script>
  `,

  `
  <script type="text/x-template" id="noresult-template">
    <div>
      <div class="search-feedback-filters-custom align-items-center"
        :class="{ active: searchStore.searchFired && !hasResults && searchStore.externalSearchResults.length === 0  }"
        v-if="searchStore.searchFired && !hasResults && searchStore.externalSearchResults.length === 0 ">
        <div class="sf-filter-info-custom">
          <span class="d-block no-result-msg">SORRY, YOUR SEARCH FOR "{{ searchStore.searchTerm }}" RETURNED NO RESULTS!
          </span><br />
          <span class="no-result-msg2">LET'S REFINE, OR TRY SEARCHING BY DIFFERENT SEARCH KEYWORDS INSTEAD.</span>
            <br />
          <span class="text-primary-main" v-if="hasSpellingSuggestion">Did you mean <a href="#"
            @click="onSpellingSuggestionClick"
            class="text-primary">{{ searchStore.spellingSuggestion }}</a>?</span>
          </div>
        </div>
      </div>
    </div>
  </script>
  `,

  `
    <script type="text/x-template" id="facet-template">
    <div class="facet-template-container-custom"
    >
    <div class="pill-container">
    <div @click="showMobileSideMenu= true"
        class="pill ">Filter By <span class="pill-close filter-by"></span></div>
    <div class="pill"
        v-for="(facet, index) in facet_qs"
        :key="facet"
        :class="{'last':facet_qs.length -1 === index }"
        @click="removeFacet(facet)">{{ showFacet(facet)}} <span class="pill-close"></span>
    </div>
    <div class="pill clear-filters"
        @click="clearFilters"
        v-if="facet_qs.length > 0">Clear Filters</div>
    </div>
    <div class="sidebar-background"
      :class="{'show-facet-overlay': showMobileSideMenu}"></div>
    <div class="sf-sidebar-container"
      :class="{'show-facet-overlay': showMobileSideMenu}">
    <div class="sf-mobile-header">
      <div class="sf-mobile-header-text">Filter By</div>
      <button type="button"
              class="btn btn-custom text-primary"
              @click="closeSideMenu">
        <span class="search-close" />
      </button>
    </div>
    <div class="sf-sidebar">
      <ul class="list-group accordion"
          id="search-facets">
        <li class="list-group-item-searchstudio-js">
          <div id="collapse-topics"
              class="collapse show"
              data-parent="#search-facets">
            <ul class="list-unstyled">
              <div id="ss-search-results">
                <div class="filters"
                    :class="{ 'd-none': !faceting_enabled }">
                  <form action="/"
                        method="get">
                    <div class="facet-list mb-4"
                        v-for="(facet, index) in computedFacets"
                        :key="index">
                      <h4 class="sidebar-heading">
                        <a href="#"
                          class="text-uppercase"
                          @click.prevent="toggleFacet(index)"
                          :class="[facet.facet_toggle ? 'active' : '']">{{ facet.facet_label }} </a>
                      </h4>
                      <div class="collapse"
                          :class="[facet.facet_toggle ? 'show' : '']">
                        <ul class="list-unstyled pl-3">
                          <li v-for="(row, i) in facet.facets"
                              :key="i"
                              :class="[row.show ? '' : 'd-none']">
                            <input type="checkbox"
                                  :disabled="row.disabled"
                                  :id="row.label"
                                  :value="encodeURIComponent(facet.facet_name) + ':&quot;' + encodeURIComponent(row.label) + '&quot;' "
                                  v-model="facet_qs"
                                  @change="doSearch">
                            <label :for="row.label"
                                  class="ml-1"
                                  :class="{'disabled': row.disabled}">
                                  <span class="facet-name" :title="row.label"
                                      :ref="'elipsisTooltip'+i+index">
                                          {{ cleanValue(getFieldValue(facet.facet_name, row.label)) }}
                                    </span>
                                    ({{ row.count }})
                                    </label>
                            <div v-if="$refs['elipsisTooltip'+i+index] && addElipsisTracking('elipsisTooltip'+i+index)"></div>
                            <div  :id="'elipsisTooltip'+i+index"
                                class="facet-tooltip-wrapper">

                              <span class="facet-tooltip">
                                {{ cleanValue(getFieldValue(facet.facet_name, row.label)) }} ({{ row.count }})
                              </span>
                            </div>
                          </li>
                        </ul>
                        <div class="more-less"
                            v-if="hasFacetPagination(index)">
                          <a href="#"
                            @click.prevent="doMoreFacets(index)"
                            v-if="hasMoreFacets(index)">More</a>
                          <a href="#"
                            @click.prevent="doLessFacets(index)"
                            v-else>Less</a>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </ul>
          </div>
        </li>
      </ul>
      <button type="button"
              class="btn btn-custom close-button"
              @click="closeSideMenu">Done</button>
    </div>
    </div>
    </div>
  </script>
  `,

  `
  <script type="text/x-template" id="paging-template">
    <div class="d-flex flex-wrap w-100 py-3 rl-search paging-container"
    v-else-if="hasResults && !reloading"
    :class="showEditPaging? 'show-edit' : ''"
    @mouseenter="mouseenterPaging"
    @mouseleave="mouseleavePaging">
    <div v-if="searchStore.builderConfig && hasResults"
      class="edit-button"
      @click="editResultsPaging">EDIT RESULT PAGING STYLE</div>
    <div class="text-left col-xl-6 col-lg-8 col-md-8 pagination-wrap">
    <ul class="pagination justify-content-end">
      <li class="page-item"
          :class="{'disabled' : searchStore.loading}">
        <a href="#"
          class="page-link-searchstudio-js"
          v-if="searchStore.searchFired"
          :disabled="searchStore.startDoc === 0 || searchStore.loading"
          @click.prevent="searchStore.startDoc !== 0 && prevPage()"
          variant="outline-primary"> &#60; Previous </a>
      </li>
      <li class="page-item">
        <span class="page-link-searchstudio-js"
              v-if="searchStore.searchFired">
          <strong>{{ searchStore.startDoc + 1 }} &mdash; {{ searchStore.endDoc }} </strong> of <strong>{{ searchStore.totalResults }}</strong>
        </span>
      </li>
      <li class="page-item"
          :class="{'disabled' : searchStore.loading}">
        <a href="#"
          class="page-link-searchstudio-js"
          v-if="searchStore.searchFired"
          :disabled="searchStore.endDoc === searchStore.totalResults || searchStore.loading"
          @click.prevent="searchStore.totalResults !== searchStore.endDoc && nextPage()"
          variant="outline-primary"> Next &#62; </a>
      </li>
    </ul>
    </div>
    </div>
  </script>
  `,

  `
  <script type="text/x-template" id="customRelatedSearches-template">
    <div
    class="related-searches-container">
    <div v-if="storeState.relatedSearches.length">

    <b>Related searches:</b>
    <span v-for="(value, index) in storeState.relatedSearches"
    :key="index"
    class="related-search">
    <a @click="search(value, $event)"
          class="related-search-item"
    href="#">
    {{ value }}<span v-if="index < storeState.relatedSearches.length - 1 ">,</span>
    </a>
    </span>
    </div>
    </div>
  </script>
  `,

  `
  <script type="text/x-template" id="external-search-result-template">
    <div class="external-searches-container">
    <div class="list-wrapper external-list-wrapper"
      :key="externalResult.url"
      v-for="externalResult in externalSearchResults">
    <div class="card-searchstudio-js-custom">
      <div class="card-searchstudio-jsClass">
        <div class="card-searchstudio-js-body p-0">
          <div class="card-searchstudio-js-title">
            <a :href="externalResult.url"
              @click.prevent="trackClick(externalResult, $event)"
              class="stretched-link">{{ externalResult.name }}</a>
          </div>
          <div class="icon-elevated" />
          <div class="card-searchstudio-js-body p-0">
            <div class="card-searchstudio-js-text content">
              <span class="SearchStax">{{ externalResult.description }}</span>
            </div>
          </div>
          <div class="card-searchstudio-js-body p-0">
            <div class="card-searchstudio-js-text content">
              <span class="SearchStax">{{ externalResult.url }}</span>
            </div>
          </div>
          <div class="card-searchstudio-js-body p-0" />
        </div>
      </div>
    </div>
    </div>
    </div>
  </script>
  `,
];

export default templates;
