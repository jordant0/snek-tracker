<script>
  export default {
    props: {
      currentFilter: {
        type: Number,
        default: 0,
      },
    },

    data() {
      return {
        selected: this.currentFilter,
      }
    },

    created() {
      this.options = [
        'All',
        'Feeding',
        'Handling',
        'Weight',
        'Shedding',
        'Other',
      ];
    },
  }
</script>

<template>
  <Page class="page">
    <StackLayout class="form-field" text-align="center">
      <Label class="label" text="Showing events:" />
      <ListPicker :items="options" v-model="selected" />

      <Button class="btn btn-primary" @tap="$modal.close(selected)" text="Filter" marginTop="20" />
    </StackLayout>
  </Page>
</template>
