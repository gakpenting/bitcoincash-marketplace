<template>
  <v-card class="mx-auto pa-6" max-width="900" outlined>
    <p class="subtitle-1 font-weight-bold">Buy Repo</p>
    <Detail :item="item" />

    <div class="d-flex justify-space-between" v-if="balance&&item.username!==username">
      <div>BALANCE</div>
      <div>{{ balance }}</div>
    </div>
    <div class="d-flex justify-space-between" v-if="satoshiToSend&&item.username!==username">
      <div>Satoshi To Send</div>
      <div>{{ satoshiToSend }}</div>
    </div>
    <div class="d-flex justify-space-between" v-if="txFee&&item.username!==username">
      <div>Transaction Fee</div>
      <div>{{ txFee }}</div>
    </div>
    <v-divider v-if="remainder&&item.username!==username" class="ma-4"></v-divider>
    <div class="d-flex justify-space-between" v-if="remainder&&item.username!==username">
      <div>Remaining Balance</div>
      <div>{{ balance - satoshiToSend - txFee }}</div>
    </div>
    <p style="color:red" v-if="remaining<=0">{{ remaining<=0?"insufficient fund":""}}</p>
    <v-card-actions>
      <v-btn class="white--text" color="blue" :disabled="disabled" href="/">
        BACK
      </v-btn>
      <v-btn class="white--text" v-if="item.username!==username" color="red" @click="buyNow" :disabled="disabled || remaining<0">
        Buy Now
      </v-btn>
    </v-card-actions>
       <v-dialog
      v-model="dialog"
      persistent
      max-width="390"
    >
       <v-card>
        <v-card-title class="headline" v-if="!gone">
          Are you sure ?
        </v-card-title>
        <v-card-text >
<v-row align="center"   justify="center" v-if="gone"><v-progress-circular
class="mt-2"
      indeterminate
      color="primary"
    ></v-progress-circular>
</v-row>
<v-row align="center"  justify="center" v-if="gone">Please wait while we procees your request</v-row>
        </v-card-text>

        <v-card-actions v-if="!gone">
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            No
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="buy"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script lang=ts>
import Cookies from 'js-cookie'
import { Component, Vue, Prop,Emit } from 'nuxt-property-decorator'
import { configs } from '@/utils/configs.js'
import Detail from '@/components/Detail.vue'
import axios from 'axios'

@Component({
  components: {
    Detail,
  },
})
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly item!: object
  @Prop({ required: true }) readonly repo_id!: string
  @Prop({ required: false }) readonly balance!: number
  @Prop({ required: false }) readonly satoshiToSend!: number
  @Prop({ required: false }) readonly txFee!: number
  @Prop({ required: false }) readonly remainder!: number
  @Prop({ required: false }) readonly disabled!: boolean
  @Prop({ required: false }) readonly dialog!: boolean
  @Prop({ required: false }) readonly gone!: boolean
  @Prop({ required: false }) readonly username!: string
  public mnemonic: string = ''

  public addresses: Array<object> = []
  public error: string = ''
  public disableBuy: boolean = true
  get remaining() {
    return this.balance - this.satoshiToSend - this.txFee
  }
  @Emit()
  buyNow(){}
 @Emit()
  buy(){}
}
</script>
