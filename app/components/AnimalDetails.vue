<script>
  export default {
    props: {
      animalId: {
        type: Number,
        default: 0,
      },
    },

    computed: {
      animal() {
        return this.$store.getters.getAnimal(this.animalId);
      },

      birthdate() {
        let date = this.animal.birthdate;

        if(date) {
          return `${date.month}/${date.day}/${date.year}`;
        }
        else {
          return '';
        }
      },
    },
  }
</script>

<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="BACK" @tap="$navigateBack" col="0"/>
        <Label class="title" :text="animal.name"  col="1"/>
      </GridLayout>
    </ActionBar>

    <StackLayout>
      <Label :text="animal.name" />

      <Label :text="birthdate" />

      <Label :text="animal.type" />

      <Label :text="animal.species" />
    </StackLayout>
  </Page>
</template>
