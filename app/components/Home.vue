<script>
  import { mapState, mapGetters } from 'vuex'
  import AnimalForm from './AnimalForm'
  import AnimalInfo from './AnimalInfo'
  import AnimalDetails from './AnimalDetails'
  import Login from './Login'

  export default {
    components: {
      AnimalInfo,
    },

    data() {
      return {
        msg: 'Why!'
      }
    },

    watch: {
      isLoggedIn() {
        if (!this.isLoggedIn) {
          this.$navigateTo(Login, { clearHistory: true });
        }
      }
    },

    computed: {
      ...mapState([
        'isLoggedIn'
      ]),

      ...mapGetters([
        'animalsList'
      ])
    },

    methods: {
      addAnimal() {
        this.$navigateTo(AnimalForm)
      },

      resetData() {
        confirm({
          title: 'Reset Data',
          message: 'Are you sure you want to reset all data?',
          okButtonText: 'Reset',
          cancelButtonText: 'Cancel'
        }).then(result => {
          this.$store.commit('reset');
        });
      },

      viewAnimal(event) {
        if(event.item) {
          this.$navigateTo(AnimalDetails, {props: {animalId: event.item.id}})
        }
      },

      onSwipeStarted ({ data, object }) {
        const swipeLimits = data.swipeLimits;
        const swipeView = object;
        const leftItem = swipeView.getViewById('left-swipe');
        const rightItem = swipeView.getViewById('right-swipe');
        swipeLimits.left = leftItem.getMeasuredWidth();
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
      },

      editAnimal({ object }) {
        this.$navigateTo(AnimalForm, {props: { animalId: object.bindingContext.id }})
      },

      deleteAnimal({ object }) {
        this.$store.commit('removeAnimal', object.bindingContext.id);
      },

      logout() {
        this.$authService.logout()
      }
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *, auto">
        <Label class="icon" :text="String.fromCharCode(0xf197)" @tap="$refs.drawer.nativeView.showDrawer()" col="0" />
        <Label class="title" text="Herps Tracker"  col="1"/>
        <Label class="icon" :text="String.fromCharCode(0xf278)" @tap="addAnimal" col="2" paddingLeft="10" />
      </GridLayout>
    </ActionBar>

    <RadSideDrawer ref="drawer">
      <FlexboxLayout ~drawerContent class="sidedrawer-content">
        <StackLayout>
          <Label class="sidedrawer-header" text="Menu"/>

          <StackLayout class="sidedrawer-list-item" orientation="horizontal" @tap="logout">
            <Label class="icon" :text="String.fromCharCode(0xf193)" />
            <Label class="title" text="Logout" />
          </StackLayout>
        </StackLayout>

        <StackLayout class="sidedrawer-list-item" orientation="horizontal" flexShrink="0" @tap="resetData">
          <Label class="icon text-danger" :text="String.fromCharCode(0xf1f4)" />
          <Label class="title text-danger" text="Reset" />
        </StackLayout>
      </FlexboxLayout>

      <StackLayout ~mainContent>
        <StackLayout v-if="animalsList.length">
          <RadListView
            for="animal in animalsList"
            class="list-group"
            swipeActions="true"
            @itemSwipeProgressStarted="onSwipeStarted"
            @itemTap="viewAnimal"
          >
            <v-template>
              <AnimalInfo :animal='animal' />
            </v-template>

            <v-template name="itemswipe">
              <GridLayout columns="auto, *, auto" backgroundColor="White">
                <FlexboxLayout id="left-swipe" col="0" class="swipe-item left" @tap="editAnimal">
                  <Label class="icon swipe-action" :text="String.fromCharCode(0xf158)" />
                </FlexboxLayout>
                <FlexboxLayout id="right-swipe" col="2" class="swipe-item right" @tap="deleteAnimal">
                  <Label class="icon swipe-action" :text="String.fromCharCode(0xf154)" />
                </FlexboxLayout>
              </GridLayout>
            </v-template>
          </RadListView>
          </RadListView >
        </StackLayout>
        <FlexboxLayout v-else class="list-empty">
          <Label text="No animals added yet" />
        </FlexboxLayout>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
