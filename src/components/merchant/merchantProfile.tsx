import { useEffect, useState } from "react";
import { getProfileById } from "../../services/merchants";

type MerchantProfile = {
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
};

type Props = { merchantId: number };

export default function MerchantProfile({ merchantId }: Props) {
  const [profile, setProfile] = useState<MerchantProfile | null>(null);

  useEffect(() => {
    getProfileById(merchantId).then((res: any) => setProfile(res.data)).catch((err: any) => console.error(err));
  }, [merchantId]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold">Merchant Profile</h2>
      <div className="mt-3 text-sm text-slate-600 space-y-1">
        <div>Name: <strong>{profile.name}</strong></div>
        <div>Email: <strong>{profile.email}</strong></div>
        <div>Phone: <strong>{profile.phone || '—'}</strong></div>
        <div>Member since: <strong>{new Date(profile.createdAt).toLocaleDateString()}</strong></div>
      </div>
    </div>
  );
}
