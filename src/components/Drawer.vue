<script setup>
import { useInternalization } from '@/composables/useInternalization'
import axios from 'axios'
import { ref, computed, inject } from 'vue'

import DrawerHead from './DrawerHead.vue'
import CartItemList from './CartItemList.vue'
import InfoBlock from './InfoBlock.vue'

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number
})

const { cart, closeDrawer } = inject('cart')

const isCreating = ref(false)
const orderId = ref(null)

const createOrder = async () => {
  try {
    isCreating.value = true

    const { data } = await axios.post(`https://3cb1e2f14460c4b9.mokky.dev/orders`, {
      items: cart.value,
      totalPrice: props.totalPrice.value
    })

    cart.value = []

    orderId.value = data.id
  } catch (err) {
    console.log(err)
  } finally {
    isCreating.value = false
  }
}

const cartIsEmpty = computed(() => cart.value.length === 0)
const buttonDisabled = computed(() => isCreating.value || cartIsEmpty.value)
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <div v-if="!totalPrice || orderId" class="flex h-full items-center">
      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Carrinho esta vazio"
        description="Adicione pelo menos um par de tênis para completar seu pedido."
        image-url="/package-icon.png"
      />
      <InfoBlock
        v-if="orderId"
        title="O pedido foi processado!"
        :description="`Seu pedido #${orderId} será enviado para os correio em breve`"
        image-url="/order-success-icon.png"
      />
    </div>

    <div v-else>
      <CartItemList />

      <div class="flex flex-col gap-4 mt-7">
        <div class="flex gap-2">
          <span>Total:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ useInternalization(totalPrice) }}</b>
        </div>

        <div class="flex gap-2">
          <span>Taxa 5%:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ useInternalization(vatPrice) }}</b>
        </div>

        <button
          :disabled="buttonDisabled"
          @click="createOrder"
          class="mt-4 transition bg-zinc-950 w-full rounded-xl py-3 text-white disabled:bg-zinc-300 hover:bg-zinc-600 active:bg-zinc-700 cursor-pointer"
        >
          Comprar
        </button>
      </div>
    </div>
  </div>
</template>
