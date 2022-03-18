<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';

import { useOnClickOutside } from '@/composables';
import useBookmarkStore from '@/store/bookmark.store';

import { createBookmark } from '@/api/bookmark';

import truncate from '@/directives/truncate';

import { Bookmark } from '@/types/bookmark.types';

type Notidate = '끄기' | '7일' | '14일' | '30일';

export default defineComponent({
  name: 'BookmarkModal',
  components: { BaseModal, BaseButton, BaseInput },
  setup() {
    const baseModal = ref<InstanceType<typeof BaseModal>>();
    const open = () => baseModal.value?.open();
    const close = () => baseModal.value?.close();

    // Notification 설정
    const notidateList = ref<Notidate[]>(['끄기', '7일', '14일', '30일']);
    const selectedNotidate = ref('');
    const selectNotidate = (notidate: Notidate) => {
      selectedNotidate.value = convertNotidate(notidate);
      toggleNotificationList();
    };
    const convertNotidate = (notidate: Notidate) => {
      switch (notidate) {
        case '7일': {
          return getRemindDate(7);
        }
        case '14일': {
          return getRemindDate(14);
        }
        case '30일': {
          return getRemindDate(30);
        }
        default: {
          return '';
        }
      }

      function getRemindDate(day: number) {
        const today = new Date();
        today.setDate(today.getDate() + day);
        return getFormattedDate(cloneDate(today));
      }

      function cloneDate(date: Date) {
        return new Date(date.valueOf());
      }

      function getFormattedDate(date: Date) {
        let year = date.getFullYear();

        let month = `${date.getMonth() + 1}`;
        if (parseInt(month) < 10) month = '0' + month.toString();

        let day = `${date.getDate()}`;
        if (parseInt(day) < 10) day = '0' + day.toString();

        return `${year}-${month}-${day}`;
      }
    };

    const notificationListContainer = ref();
    const isNotificationListShown = ref(false);
    const toggleNotificationList = () =>
      (isNotificationListShown.value = !isNotificationListShown.value);
    useOnClickOutside(notificationListContainer, () => {
      isNotificationListShown.value = false;
    });

    // Form 제출 및 유효성 검사
    const bookmarkForm = ref();
    const formData = ref<Bookmark>({
      title: '',
      url: '',
      description: '',
      notidate: '',
      tags: [],
    });
    const addTag = (e: Event) => {
      const tagName = (e.target as HTMLInputElement).value.trim();
      if (!tagName) return;
      if (isTagDuplicate(tagName)) return;

      formData.value.tags.push(tagName);
      (e.target as HTMLInputElement).value = '';
    };
    const isTagDuplicate = (tagName: string) => {
      for (const tag of formData.value.tags) {
        if (tag === tagName) return true;
      }
      return false;
    };
    const isReadyToSubmit = computed(() => {
      if (formData.value.title && formData.value.url) return true;
      return false;
    });

    const bookmarkStore = useBookmarkStore();
    const isLoading = ref(false);
    const onSubmitForm = async () => {
      isLoading.value = true;
      formData.value.notidate = selectedNotidate.value;
      const res = await createBookmark(formData.value);
      const createdDate = res.timestamp.split(' ')[0];

      isLoading.value = false;

      formData.value.createdDate = createdDate;
      bookmarkStore.addOneBookmarkToList(formData.value);
      bookmarkStore.addOneBookmarkToTagWithBookmarkSet(formData.value);

      close();
    };

    return {
      baseModal,
      open,
      close,

      notidateList,
      selectNotidate,
      selectedNotidate,

      notificationListContainer,
      isNotificationListShown,
      toggleNotificationList,

      formData,
      bookmarkForm,
      addTag,
      isReadyToSubmit,

      isLoading,
      onSubmitForm,
    };
  },
  directives: {
    truncate,
  },
});
</script>

<template>
  <BaseModal ref="baseModal" id="bookmark-modal" type="confirm">
    <header>
      <div class="bookmark-modal-logo">
        <img src="@/assets/peekabook-logo-title.svg" alt="피카북 로고" />
      </div>
      <div class="bookmark-modal-notification" @click="toggleNotificationList">
        <img
          class="bell-disabled"
          v-if="selectedNotidate === '끄기'"
          src="@/assets/icons/bell-disabled.svg"
          alt="알람 설정 아이콘"
        />
        <img
          class="bell"
          v-else
          src="@/assets/icons/bell.svg"
          alt="알람 설정 아이콘"
        />
        <span>{{ selectedNotidate ? selectedNotidate : '끄기' }}</span>
      </div>
      <ul
        ref="notificationListContainer"
        v-if="isNotificationListShown"
        class="bookmark-modal-notification-list"
      >
        <li
          v-for="notidate in notidateList"
          :key="notidate"
          @click.stop="selectNotidate(notidate)"
        >
          {{ notidate }}
        </li>
      </ul>
    </header>
    <main>
      <input
        v-model="formData.title"
        class="bookmark-modal-title"
        placeholder="제목"
      />
      <form @submit.prevent="onSubmitForm" ref="bookmarkForm">
        <div class="bookmark-url-container">
          <BaseInput v-model="formData.url" type="url" placeholder="URL" />
        </div>
        <div class="bookmark-memo-container">
          <textarea
            v-model="formData.description"
            placeholder="메모"
          ></textarea>
        </div>
        <div class="bookmark-tag-container">
          <BaseInput @keydown.enter.prevent="addTag" placeholder="태그" />
          <ul class="tag-list">
            <li v-for="tag in formData.tags" :key="tag">
              <span v-truncate>{{ tag }}</span>
              <img src="@/assets/icons/x-icon.svg" alt="취소 아이콘" />
            </li>
          </ul>
        </div>
        <footer class="modal-confirm-footer">
          <BaseButton class="cancel-btn" @click="close">취소</BaseButton>
          <BaseButton
            :isLoading="isLoading"
            :disabled="!isReadyToSubmit"
            class="confirm-btn"
            >저장</BaseButton
          >
        </footer>
      </form>
    </main>
  </BaseModal>
</template>

<style lang="scss">
@import '@/design/_responsive.scss';

#bookmark-modal {
  padding: 24px !important;
  width: 320px;
  min-height: 404px;

  @include respond-to(tablet) {
    min-width: 320px;
    padding: 0px 20px 20px 20px;
  }

  header {
    position: relative;
    margin-bottom: 12px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .bookmark-modal-logo {
      width: 84px;
      height: 20px;

      img {
        width: 100%;
        height: auto;
      }
    }

    .bookmark-modal-notification {
      min-width: 28px;
      min-height: 28px;

      display: flex;
      justify-content: center;
      align-items: center;

      border: 1px solid #dee2e6;
      box-sizing: border-box;
      border-radius: 99px;

      img {
        width: 20px;
        height: 20px;
      }

      span {
        display: none;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        color: #868e96;
      }

      &:hover {
        padding: 0 8px;
        cursor: pointer;
        width: 64px;
        justify-content: space-between;
      }

      &:hover span {
        display: block;
      }
    }

    ul.bookmark-modal-notification-list {
      position: absolute;
      right: 0;
      top: 0;

      margin: 0;
      padding: 0;
      list-style: none;

      background: #ffffff;
      border: 1px solid #868e96;
      box-sizing: border-box;
      box-shadow: 0px 0px 8px rgba(73, 80, 87, 0.1);
      border-radius: 4px;

      li {
        width: 62px;
        height: 28px;
        padding: 7px 18px;

        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        color: #343a40;
        color: #868e96;

        &:hover {
          background: #f8f9fa;
          cursor: pointer;
          color: #343a40;
        }

        &:first-child {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        &:last-child {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
}

main {
  .bookmark-modal-title {
    font-weight: 600;
    font-size: 17px;
    line-height: 26px;
    color: #343a40;

    margin-top: 0px;
    margin-bottom: 20px;
    border: none;
    outline: none;

    caret-color: #ff69b4;

    &::placeholder {
      color: #ced4da;
    }
  }

  form {
    .bookmark-url-container {
      height: 40px;
    }

    .bookmark-tag-container > input {
      height: 40px !important;
    }

    .bookmark-url-container,
    .bookmark-tag-container {
      width: 272px;

      box-sizing: border-box;
      border-radius: 4px;

      margin-bottom: 12px;
    }

    .bookmark-memo-container {
      width: 272px;
      height: 104px;
      box-sizing: border-box;
      border-radius: 4px;
      margin-bottom: 12px;

      textarea {
        padding: 10px 12px;
        resize: none;
        width: 100%;
        height: 100%;
        border: 1px solid #dee2e6;
        border-radius: 4px;

        &:focus {
          outline: 1px solid #868e96;
        }

        &::placeholder {
          color: #ced4da;
        }
      }
    }

    .bookmark-tag-container {
      .tag-list {
        display: flex;
        flex-wrap: wrap;

        margin: 0;
        margin-bottom: 8px;
        padding: 0;
        list-style: none;
        margin-bottom: 24px;

        li {
          height: 24px;
          padding: 4px 8px;
          margin-right: 4px;
          background: #ffebee;
          border-radius: 4px;

          margin-top: 8px;

          display: flex;
          align-items: center;

          span {
            margin-right: 4px;
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            color: #ff69b4;
          }
        }
      }
    }
  }
}
</style>
