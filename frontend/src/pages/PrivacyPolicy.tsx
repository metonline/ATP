import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gizlilik Politikası</h1>
          <p className="text-gray-600">Son güncellenme: 18 Ağustos 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Giriş</h2>
            <p>
              ATP (Akıllı Tarım Platformu) olarak, kişisel verilerinizin korunması bizim için en yüksek önceliğidir.
              Bu gizlilik politikası, platformumuzda kayıt olduğunuzda ve hizmetlerimizi kullandığınızda
              verilerinizin nasıl toplanıp işlendiğini açıklamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Toplanan Veriler</h2>
            <p>Platform kullanımı sırasında aşağıdaki verileri toplayabiliriz:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Hesap Bilgileri:</strong> Ad, soyad, email, telefon, kullanıcı adı, şifre (şifrelenmiş)</li>
              <li><strong>Çiftlik Verileri:</strong> Çiftlik adı, konum, arazi büyüklüğü, ürün türleri</li>
              <li><strong>Parsel Bilgileri:</strong> Parsel koordinatları, geometri, alan ölçümleri</li>
              <li><strong>Uydu Görüntüleri:</strong> Sentinel-2 uydu görüntüleri ve hesaplanan endeksler (NDVI vb.)</li>
              <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgisi, son giriş tarihi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Verilerin Kullanım Amaçları</h2>
            <p>Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hizmet sağlama ve platform işletimi</li>
              <li>Çiftlik yönetimi ve uydu analizi</li>
              <li>Bitki sağlığı endeksleri hesaplama ve gösterilmesi</li>
              <li>Ürünlerimizin iyileştirilmesi</li>
              <li>Yasal ve güvenlik gereklilikleri</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. KVKK Uyumluluğu</h2>
            <p>
              Kişisel Verilerin Korunması Kanunu (KVKK) hükümlerine uyuyoruz. Aşağıdaki haklarınız vardır:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Erişim Hakkı:</strong> Kişisel verilerinize erişebilirsiniz</li>
              <li><strong>Düzeltme Hakkı:</strong> Yanlış verileri düzelttirebilirsiniz</li>
              <li><strong>Silme Hakkı:</strong> Hesabınızı ve tüm verilerinizi silebilirsiniz</li>
              <li><strong>İşleme Rızasını Geri Çekme Hakkı:</strong> Veri işlemesine onay vermeyebilirsiniz</li>
              <li><strong>Veri Taşınabilirliği:</strong> Verilerinizi dışa aktarabilirsiniz (JSON/CSV)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Admin Onayı</h2>
            <p>
              Platformumuz kayıtlı çiftçilerin kalitesini sağlamak için admin onay sistemi kullanır.
              Kaydınız admin tarafından onaylanıncaya kadar platforma tam erişim sağlanmayacaktır.
              Onay süreci genellikle 1-2 gün sürer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Veri Depolama</h2>
            <p>
              Kişisel verileriniz şifrelenmiş veritabanında saklanmaktadır. Uydu görüntüleri
              Google Earth Engine ve bulut depolamada tutulmaktadır. Verileriniz sadece ilgili
              kişilerce erişilebilir durumdadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Veri Silme ve Dışa Aktarma</h2>
            <p>Profil sayfanızda aşağıdaki işlemleri gerçekleştirebilirsiniz:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Verilerimi İndir:</strong> Tüm kişisel verilerinizin bir kopyasını alabilirsiniz</li>
              <li><strong>Hesabımı Sil:</strong> Hesabınız ve ilişkili tüm veriler kalıcı olarak silinir</li>
              <li><strong>Rızayı Geri Çek:</strong> Gelecekte veri işlemesine onay vermeyebilirsiniz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. İletişim</h2>
            <p>
              Gizlilik hakkında sorularınız veya talepleriniz için lütfen şu adrese yazınız:<br />
              <strong>Email:</strong> privacy@atp.platform<br />
              <strong>Adres:</strong> ATP Platform, Ankara, Türkiye
            </p>
          </section>

          <section className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Bu Politikayı Kabul Etmek</h2>
            <p>
              Platform kayıt olurken bu gizlilik politikasını kabul etmiş olursunuz.
              Politikada yapılan değişiklikler email yoluyla size bildirilir.
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}
