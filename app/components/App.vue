<script>
  import { mapGetters } from 'vuex'
  import AddAnimal from './AddAnimal'
  import AnimalDetails from './AnimalDetails'

  export default {
    data() {
      return {
        msg: 'Why!'
      }
    },

    computed: {
      ...mapGetters([
        'animalsList'
      ])
    },

    methods: {
      addAnimal() {
        this.$navigateTo(AddAnimal)
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
      }
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *">
        <Label class="icon" :text="String.fromCharCode(0xf197)" @tap="$refs.drawer.nativeView.showDrawer()" col="0" />
        <Label class="title" text="Snek Tracker"  col="1"/>
      </GridLayout>
    </ActionBar>

    <RadSideDrawer ref="drawer">
      <StackLayout ~drawerContent backgroundColor="#ffffff">
        <Label class="sidedrawer-header" text="Menu"/>

        <Label class="sidedrawer-list-item" text="Add Animal" @tap="addAnimal"/>
        <Label class="sidedrawer-list-item" text="Reset" @tap="resetData"/>
      </StackLayout>

      <StackLayout ~mainContent columns="*" rows="*">
        <ListView for="animal in animalsList" class="list-group" @itemTap="viewAnimal">
          <v-template>
            <Label class="list-group-item" :text="`${animal.name} (${animal.type})`" />
          </v-template>
        </ListView>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
