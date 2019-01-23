<script>
  import App from './App'

  export default {
    data() {
      return {
        name: '',
        birthdate: new Date(),
        typeIndex: 0,
        species: '',
      }
    },

    created() {
      this.typesList = [
        'Unknown',
        'Snake',
        'Lizard',
        'Bird',
        'Fish',
      ];
    },

    methods: {
      addAnimal() {
        this.$store.commit('addAnimal', {
          name: this.name,
          birthdate: this.birthdate,
          type: this.typesList[this.typeIndex],
          species: this.species,
        });

        this.$navigateTo(App)
      },
    },
  }
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="auto, *">
        <Label class="icon" :text="String.fromCharCode(0xf2fa)" @tap="$navigateBack" col="0" />
        <Label class="title" text="Add Animal"  col="1"/>
      </GridLayout>
    </ActionBar>

    <StackLayout>
      <Label class="label" text="Name" />
      <TextField v-model="name" hint="Enter animal's name..." />

      <Label class="label" text="Birthdate" />
      <DatePicker v-model="birthdate" />

      <Label class="label" text="Type" />
      <ListPicker :items="typesList" v-model="typeIndex" />

      <Label class="label" text="Species" />
      <TextField v-model="species" hint="Enter species name..." />

      <Button text="Add" @tap="addAnimal" />
    </StackLayout>
  </Page>
</template>
