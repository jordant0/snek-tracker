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
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="$refs.drawer.nativeView.showDrawer()" col="0"/>
        <Label class="title" text="Snek Tracker"  col="1"/>
      </GridLayout>
    </ActionBar>

    <RadSideDrawer ref="drawer">
      <StackLayout ~drawerContent backgroundColor="#ffffff">
        <Label class="drawer-header" text="Menu"/>

        <Label class="drawer-item" text="Add Animal" @tap="addAnimal"/>
        <Label class="drawer-item" text="Reset" @tap="resetData"/>
      </StackLayout>

      <StackLayout ~mainContent columns="*" rows="*">
        <ListView for="animal in animalsList" @itemTap="viewAnimal">
          <v-template>
            <Label class="list-item" :text="`${animal.name} (${animal.type})`" />
          </v-template>
        </ListView>
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>

<style>
  ActionBar {
    background-color: #53ba82;
    color: #ffffff;
  }

  .list-item {
    padding: 10 20;
  }

  .title {
    text-align: left;
    padding-left: 16;
  }

  .message {
    vertical-align: center;
    text-align: center;
    font-size: 20;
    color: #333333;
  }

  .drawer-header {
    padding: 50 16 16 16;
    margin-bottom: 16;
    background-color: #53ba82;
    color: #ffffff;
    font-size: 24;
  }

  .drawer-item {
    padding: 8 16;
    color: #333333;
    font-size: 16;
  }
</style>
