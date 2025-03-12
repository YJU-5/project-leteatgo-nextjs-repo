"use client"
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Sidebar from '../Sidebar/Sidebar';
import FollowList from '@/components/FollowList/FollowList';
import InquiryList from '@/components/InquiryList/InquiryList';
import MyReviews from '@/components/MyReviews/MyReviews';

export default function MyPageSection() {
  const router = useRouter();
  const params = useParams();
  const section = params?.section as string | undefined;

  // 기본적으로 "팔로우 관리"로 리다이렉션
  if (!section) {
    router.replace('/mypage/follow');
    return null;
  }

  return (
    <>
      {section === 'follow' && <FollowList />}
      {section === 'inquiries' && <InquiryList />}
      {section === 'myreviews' && <MyReviews/>}
      {section === 'event-info' && <h1>내 개최정보 (미구현)</h1>}
    </>
  );  
}