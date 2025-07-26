<template>
  <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="divide-y divide-gray-900/10">
      <!-- Profile Section -->
      <div class="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div class="px-4 sm:px-0">
          <h2 class="text-base/7 font-semibold text-gray-900">Profile</h2>
          <p class="mt-1 text-sm/6 text-gray-600">
            Only your photo and name will be displayed publicly. Your mobile number is private.
          </p>
        </div>

        <form
          @submit.prevent="updateProfile"
          class="bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2"
        >
          <div class="px-4 py-6 sm:p-8">
            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <!-- Name -->
              <div class="sm:col-span-4">
                <label
                  for="name"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Name</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    v-model="profileForm.name"
                    :class="[
                      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6',
                      errors.name ? 'outline-red-300 focus:outline-red-600' : 'outline-gray-300'
                    ]"
                    placeholder="Your full name"
                  />
                  <p
                    v-if="errors.name"
                    class="mt-1 text-sm text-red-600"
                    >{{ errors.name }}</p
                  >
                </div>
              </div>

              <!-- Phone -->
              <div class="sm:col-span-4">
                <label
                  for="phone"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Phone</label
                >
                <div class="mt-2">
                  <div
                    :class="[
                      'flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600',
                      errors.phone
                        ? 'outline-red-300 focus-within:outline-red-600'
                        : 'outline-gray-300'
                    ]"
                  >
                    <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"
                      >+962</div
                    >
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      v-model="profileForm.phone"
                      class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      placeholder="78xxxxxxx"
                    />
                  </div>
                  <p
                    v-if="errors.phone"
                    class="mt-1 text-sm text-red-600"
                    >{{ errors.phone }}</p
                  >
                </div>
              </div>

              <!-- Avatar Photo -->
              <div class="col-span-full">
                <label
                  for="avatar"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Photo</label
                >
                <div class="mt-2 flex items-center gap-x-3">
                  <div
                    class="size-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
                  >
                    <img
                      v-if="(user?.avatar && !avatarRemoved) || previewAvatar"
                      :src="previewAvatar || avatarUrl || ''"
                      :alt="`${user?.name || 'User'} avatar`"
                      class="w-full h-full object-cover"
                    />
                    <svg
                      v-else
                      class="size-8 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="flex gap-x-2">
                    <input
                      ref="avatarInput"
                      type="file"
                      accept="image/*"
                      @change="handleAvatarChange"
                      class="hidden"
                    />
                    <Button
                      type="button"
                      variant="soft"
                      size="sm"
                      @click="avatarInput?.click()"
                    >
                      Change
                    </Button>
                    <Button
                      v-if="(user?.avatar && !avatarRemoved) || profileForm.avatar"
                      type="button"
                      variant="soft"
                      size="sm"
                      @click="removeAvatar"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
          >
            <Button
              type="button"
              variant="ghost"
              @click="resetProfile"
              :disabled="profileLoading"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              :disabled="!hasProfileChanges || profileLoading"
            >
              <Loader2
                v-if="profileLoading"
                class="mr-2 h-4 w-4 animate-spin"
              />
              Save
            </Button>
          </div>
        </form>
      </div>

      <!-- Personal Information Section -->
      <div class="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div class="px-4 sm:px-0">
          <h2 class="text-base/7 font-semibold text-gray-900">Delivery Information</h2>
          <p class="mt-1 text-sm/6 text-gray-600">
            Your office location for food delivery within the company.
          </p>
        </div>

        <form
          @submit.prevent="updateAddress"
          class="bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2"
        >
          <div class="px-4 py-6 sm:p-8">
            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <!-- Email (Read-only) -->
              <div class="sm:col-span-4">
                <label
                  for="email"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Email address</label
                >
                <div class="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    :value="user?.email || 'Not provided'"
                    readonly
                    disabled
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:outline-gray-200 sm:text-sm/6"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500"
                  >Email cannot be changed here. Contact support if needed.</p
                >
              </div>

              <!-- Floor Number -->
              <div class="sm:col-span-3">
                <label
                  for="floor-number"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Floor Number</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="floor-number"
                    id="floor-number"
                    v-model="addressForm.floor"
                    :class="[
                      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6',
                      errors.floor ? 'outline-red-300 focus:outline-red-600' : 'outline-gray-300'
                    ]"
                    placeholder="e.g., 3"
                  />
                  <p
                    v-if="errors.floor"
                    class="mt-1 text-sm text-red-600"
                    >{{ errors.floor }}</p
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
          >
            <Button
              type="button"
              variant="ghost"
              @click="resetAddress"
              :disabled="addressLoading"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              :disabled="!hasAddressChanges || addressLoading"
            >
              <Loader2
                v-if="addressLoading"
                class="mr-2 h-4 w-4 animate-spin"
              />
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import Dialog from '~/components/ui/Dialog.vue'
import {Loader2} from 'lucide-vue-next'

definePageMeta({layout: 'user', middleware: 'authenticated'})

useHead({title: 'Profile Settings'})

const avatarInput = ref<HTMLInputElement>()

const {user, avatarUrl} = useAuth()
const {$pb} = useNuxtApp()
const {success, error: showError} = useToast()

// Form data
const profileForm = reactive({
  name: '',
  phone: '',
  avatar: null as File | null
})

const addressForm = reactive({floor: ''})

// UI states
const errors = reactive({name: '', phone: '', floor: ''})

const previewAvatar = ref('')
const avatarRemoved = ref(false)
const profileLoading = ref(false)
const addressLoading = ref(false)

// Initialize forms
function initForms() {
  if (!user.value) return

  profileForm.name = user.value.name || ''
  profileForm.phone = user.value.phone || ''

  // Handle floor_number - convert number to string for text input
  addressForm.floor = user.value.floor_number ? String(user.value.floor_number) : ''

  clearErrors()
}

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
}

// Avatar handling
function handleAvatarChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  profileForm.avatar = file
  avatarRemoved.value = false

  const reader = new FileReader()
  reader.onload = (e) => {
    previewAvatar.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function removeAvatar() {
  profileForm.avatar = null
  previewAvatar.value = ''
  avatarRemoved.value = true
}

// Validation
function validateProfile() {
  clearErrors()
  let isValid = true

  if (!profileForm.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  if (profileForm.phone && !/^7[789]\d{7}$/.test(profileForm.phone)) {
    errors.phone = 'Phone must be a valid mobile number'
    isValid = false
  }

  return isValid
}

function validateAddress() {
  errors.floor = ''

  if (!addressForm.floor || !addressForm.floor.trim()) {
    errors.floor = 'Floor number is required'
    return false
  }

  const floorNum = parseInt(addressForm.floor.trim())
  if (isNaN(floorNum) || floorNum <= 0) {
    errors.floor = 'Floor must be a positive number'
    return false
  }

  return true
}

// Update functions
async function updateProfile() {
  if (!validateProfile()) return

  profileLoading.value = true
  try {
    const formData = new FormData()

    if (profileForm.name !== user.value?.name) {
      formData.append('name', profileForm.name)
    }
    if (profileForm.phone !== user.value?.phone) {
      formData.append('phone', profileForm.phone)
    }
    if (profileForm.avatar) {
      formData.append('avatar', profileForm.avatar)
    } else if (avatarRemoved.value) {
      formData.append('avatar', '')
    }

    await $pb.collection('users').update(user.value!.id, formData)
    await $pb.collection('users').authRefresh()

    success('Profile updated successfully!')
    // Form will automatically update with new values via watch(user, initForms)
  } catch (err: any) {
    showError(err.message || 'Failed to update profile')
  } finally {
    profileLoading.value = false
  }
}

async function updateAddress() {
  if (!validateAddress()) return

  addressLoading.value = true
  try {
    // Convert string to number for database storage
    const floorNumber = parseInt(addressForm.floor.trim())

    await $pb.collection('users').update(user.value!.id, {
      floor_number: floorNumber
    })
    await $pb.collection('users').authRefresh()

    success('Address updated successfully!')
  } catch (err: any) {
    showError(err.data?.message || err.message || 'Failed to update address')
  } finally {
    addressLoading.value = false
  }
}

// Reset functions
function resetProfile() {
  initForms()
  // Clear avatar preview states
  previewAvatar.value = ''
  avatarRemoved.value = false
  profileForm.avatar = null
}

function resetAddress() {
  initForms()
}

// Computed properties
const hasProfileChanges = computed(() => {
  if (!user.value) return false
  return (
    profileForm.name !== (user.value.name || '') ||
    profileForm.phone !== (user.value.phone || '') ||
    profileForm.avatar !== null ||
    avatarRemoved.value
  )
})

const hasAddressChanges = computed(() => {
  if (!user.value) return false
  const currentFloor = user.value.floor_number ? String(user.value.floor_number) : ''
  return addressForm.floor !== currentFloor
})

// Initialize on mount
watch(user, initForms, {immediate: true})
</script>
