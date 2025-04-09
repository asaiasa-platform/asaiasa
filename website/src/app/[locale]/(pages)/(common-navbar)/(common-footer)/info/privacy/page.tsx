import React from "react";

export default function PrivacyTermPage() {
  return (
    <div className="font-prompt max-w-[1170px] mx-auto px-6 min-h-[80vh] mt-[90px]">
      <h1 className="text-3xl font-bold mb-8">นโยบายความเป็นส่วนตัว</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">
            1. ข้อมูลที่เราเก็บรวบรวม
          </h2>
          <p className="text-gray-600">
            เราเก็บรวบรวมข้อมูลที่ท่านให้กับเราโดยตรง เช่น:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>ชื่อ นามสกุล และข้อมูลการติดต่อ</li>
            <li>ข้อมูลการเข้าสู่ระบบและบัญชีผู้ใช้</li>
            <li>ข้อมูลการทำธุรกรรม</li>
            <li>ข้อมูลการใช้งานเว็บไซต์</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            2. วัตถุประสงค์ในการใช้ข้อมูล
          </h2>
          <p className="text-gray-600">เราใช้ข้อมูลของท่านเพื่อ:</p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>ให้บริการและพัฒนาประสบการณ์การใช้งาน</li>
            <li>ดำเนินการตามคำขอและธุรกรรมของท่าน</li>
            <li>ส่งข้อมูลข่าวสารและการตลาด (หากท่านยินยอม)</li>
            <li>ปรับปรุงและพัฒนาบริการของเรา</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. การเปิดเผยข้อมูล</h2>
          <p className="text-gray-600">
            เราไม่เปิดเผยข้อมูลส่วนบุคคลของท่านให้กับบุคคลภายนอก ยกเว้น:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>ได้รับความยินยอมจากท่าน</li>
            <li>เพื่อปฏิบัติตามกฎหมาย</li>
            <li>กับพันธมิตรทางธุรกิจที่ให้บริการแก่เรา</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. การรักษาความปลอดภัย</h2>
          <p className="text-gray-600">
            เรามีมาตรการรักษาความปลอดภัยทางเทคนิคและทางกายภาพที่เหมาะสมเพื่อปกป้องข้อมูลของท่าน
            จากการเข้าถึง การใช้ หรือการเปิดเผยโดยไม่ได้รับอนุญาต
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. สิทธิของท่าน</h2>
          <p className="text-gray-600">ท่านมีสิทธิ:</p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>เข้าถึงข้อมูลส่วนบุคคลของท่าน</li>
            <li>แก้ไขข้อมูลที่ไม่ถูกต้อง</li>
            <li>ขอลบข้อมูล</li>
            <li>คัดค้านการประมวลผลข้อมูล</li>
            <li>ถอนความยินยอม</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. การติดต่อเรา</h2>
          <p className="text-gray-600">
            หากท่านมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้
            หรือต้องการใช้สิทธิของท่าน กรุณาติดต่อเราที่:
          </p>
          <div className="mt-2 text-gray-600">
            <p>อีเมล: privacy@example.com</p>
            <p>โทรศัพท์: 02-xxx-xxxx</p>
            <p>
              ที่อยู่: เลขที่ xx อาคาร xxx ถนน xxx แขวง/ตำบล xxx เขต/อำเภอ xxx
              จังหวัด xxx
            </p>
          </div>
        </section>

        <section className="mt-8">
          <p className="text-sm text-gray-500">
            นโยบายความเป็นส่วนตัวนี้มีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม 2567
          </p>
        </section>
      </div>
    </div>
  );
}
