<template>
  <v-row justify="center" align="center" :class="['text-h1']">
    <v-card class="mx-auto my-12" max-width="1000">
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img height="250" :src="item.openGraphImageUrl"></v-img>

      <v-card-title>{{ item.name }}</v-card-title>

      <v-card-text>
        <div>{{ item.description }}</div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title :style="{cursor:'pointer'}" @click="convertCrypto(item.amount, convertTo)">
        {{ convertTo === 'satoshi' ? 'tBCH' : 'satoshi' }}
        {{
          convertCrypto(
            item.amount,
            convertTo === 'satoshi' ? 'tBCH' : 'satoshi'
          )
        }}
        </v-card-title
      >

      <v-card-actions>
        <v-btn
  
          class="d-flex justify-end"
          color="deep-purple lighten-2"
          :href="item.url"
          target="_blank"
          text
        >
          GO TO URL
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { configs } from '@/utils/configs.js'
import axios from 'axios'
@Component
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly item!: object
  public convertTo: string = 'tBCH'
  convertCrypto(amount: number, to = 'satoshi') {
    const url = configs.url
    if (to === 'satoshi') {
      this.convertTo = 'tBCH'
      return amount
    } else {
      this.convertTo = 'satoshi'
      return amount / 100000000
    }
  }
}
</script>

