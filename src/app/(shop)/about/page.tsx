"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccountSettings } from "@/hooks/useAccountSettings";

const ABOUT_COPY = {
  en: {
    heroPrefix: "About",
    heroBrand: "Overlord Toys",
    heroText:
      "Your trusted destination for premium toys and collectibles since 2020. We curate the extraordinary for those who refuse to settle for the common.",
    missionEyebrow: "Our Mission",
    missionTitle: "Built on Passion & Authenticity",
    missionParagraphs: [
      "What started as a private collection in 2020 evolved into a global sanctuary for enthusiasts. Overlord Toys was born from the frustration of finding genuine, high-tier collectibles in a sea of replicas.",
      "We believe every artifact tells a story. Our team of expert curators travels across continents to secure exclusive partnerships with the world's most innovative toy manufacturers, ensuring every item in our vault is 100% authentic.",
      "At the heart of Overlord is a community. We do not just sell toys; we foster a digital reliquary where collectors can connect, showcase, and celebrate the artistry behind high-end manufacturing.",
    ],
    stats: [
      ["50,000+", "Happy Customers"],
      ["10,000+", "Products"],
      ["99.5%", "Satisfaction Rate"],
      ["24/7", "Customer Support"],
    ],
    valuesTitle: "The Core Protocols",
    valuesText:
      "The principles that guide every acquisition and interaction in our ecosystem.",
    values: [
      {
        icon: "verified",
        title: "Quality First",
        text: "Every piece undergoes a multi-point inspection. We only sell authentic, premium products from verified sources.",
      },
      {
        icon: "group",
        title: "Community",
        text: "Built by collectors for collectors. We host exclusive events and build spaces for our vault members.",
      },
      {
        icon: "biotech",
        title: "Innovation",
        text: "Access the latest tech-integrated toys and limited figures from globally renowned designers.",
      },
    ],
    teamTitle: "Meet Our Team",
    team: [
      {
        name: "Marcus Vane",
        role: "Chief Curator & Founder",
        text: "Oversees all artifact acquisitions and global manufacturer partnerships.",
      },
      {
        name: "Elias Thorne",
        role: "Exhibition Director",
        text: "Designs the digital and physical gallery experiences for new releases.",
      },
      {
        name: "Kai Satori",
        role: "Head of Community",
        text: "Manages collector relations and VIP membership protocols.",
      },
    ],
    ctaTitle: "Ready to Start Your Collection?",
    ctaText:
      "Join the thousands of serious collectors who trust Overlord Toys for their next artifact.",
    shopNow: "Shop Now",
    viewJournal: "View Journal",
  },
  vi: {
    heroPrefix: "Giới thiệu",
    heroBrand: "Overlord Toys",
    heroText:
      "Điểm đến đáng tin cậy cho đồ chơi cao cấp và mô hình sưu tầm từ năm 2020. Chúng tôi tuyển chọn những sản phẩm khác biệt cho người yêu sưu tầm.",
    missionEyebrow: "Sứ mệnh",
    missionTitle: "Xây dựng từ đam mê và sự chân thật",
    missionParagraphs: [
      "Từ một bộ sưu tập cá nhân vào năm 2020, Overlord Toys dần trở thành nơi dành cho những người yêu đồ chơi và mô hình cao cấp. Dự án ra đời vì chúng tôi muốn người mua dễ tìm được sản phẩm thật, chất lượng tốt, thay vì phải lo lắng giữa rất nhiều hàng sao chép.",
      "Mỗi món đồ đều có câu chuyện riêng. Đội ngũ tuyển chọn của chúng tôi tìm kiếm đối tác và nguồn hàng đáng tin cậy để bảo đảm sản phẩm trong cửa hàng có nguồn gốc rõ ràng.",
      "Overlord Toys không chỉ bán đồ chơi. Chúng tôi muốn xây dựng một không gian để người sưu tầm kết nối, chia sẻ và trân trọng giá trị thiết kế phía sau từng sản phẩm.",
    ],
    stats: [
      ["50.000+", "Khách hàng hài lòng"],
      ["10.000+", "Sản phẩm"],
      ["99,5%", "Mức độ hài lòng"],
      ["24/7", "Hỗ trợ khách hàng"],
    ],
    valuesTitle: "Giá trị cốt lõi",
    valuesText:
      "Những nguyên tắc định hướng cách chúng tôi chọn sản phẩm và phục vụ khách hàng.",
    values: [
      {
        icon: "verified",
        title: "Chất lượng trước tiên",
        text: "Mỗi sản phẩm đều được kiểm tra kỹ. Cửa hàng ưu tiên các mặt hàng chính hãng, cao cấp và có nguồn cung rõ ràng.",
      },
      {
        icon: "group",
        title: "Cộng đồng",
        text: "Được xây dựng bởi người sưu tầm cho người sưu tầm. Chúng tôi tạo không gian để thành viên cùng khám phá và chia sẻ đam mê.",
      },
      {
        icon: "biotech",
        title: "Đổi mới",
        text: "Cập nhật các mẫu đồ chơi công nghệ, mô hình giới hạn và sản phẩm đến từ những nhà thiết kế nổi bật.",
      },
    ],
    teamTitle: "Đội ngũ của chúng tôi",
    team: [
      {
        name: "Marcus Vane",
        role: "Nhà sáng lập kiêm trưởng bộ phận tuyển chọn",
        text: "Phụ trách lựa chọn sản phẩm và xây dựng quan hệ với nhà sản xuất.",
      },
      {
        name: "Elias Thorne",
        role: "Giám đốc trưng bày",
        text: "Thiết kế trải nghiệm giới thiệu sản phẩm trên nền tảng số và tại các sự kiện.",
      },
      {
        name: "Kai Satori",
        role: "Trưởng bộ phận cộng đồng",
        text: "Phụ trách quan hệ khách hàng và chương trình thành viên.",
      },
    ],
    ctaTitle: "Sẵn sàng bắt đầu bộ sưu tập?",
    ctaText:
      "Tham gia cùng những người sưu tầm đang tin chọn Overlord Toys cho sản phẩm tiếp theo của họ.",
    shopNow: "Mua sắm ngay",
    viewJournal: "Xem nhật ký",
  },
};

const TEAM_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDv9eHtqzOE5yyw5zKt06N8bswrLqOaLPhuQHuUtoQRKck0bz96zsXhKttoIIpePlU7GhlFdz8wXaik-YS7e8jNWH9Enx8niwQjcqSmIdtNJ776xlifgPkH7vPG_Xr9t8BcR1ToMQm-rFtmRi4Il8NHoC617EtYlfDTr5nM5l61MYNutcdwxsV_WXwdGnLsN0Yfb5FDQiVHrz4dTUtsPms5F29HUMLiz4r9Ou0mD6hQMnWRoy1YlKWXWlVH9LyAADj5djHIy9FV4L0",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDlrJktrfRXiZpVtzws5l7PZIwl5nHdHij7_4vOpF0tBzgTM8QtfaoWknaHdsYtDOjUtbAzff-ahjnzFkQrnPqMM4C2HjMtwWsOQdyVGfUIAoEmEMlp0oVoBNEYk-MkERyX5Cj7siM0AS2b7RRhmi6DDv1ucyd4Ug3Y4jRrRh1JxaZiO8R3_t1Qij7gGae2VwYmT_k01IczH8Ds2UpAdTG_H1ZIgVufmdRFZmOLQb8ZuciB3nZHuXhzV2z3-VIeOZ2egDy99JtnMuE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCmLuYiHRBcCII_FhzqoE2Kb9_QQp9pjtuhKoY2aX--b3gAUBCHJvKoHUTpRVdZZ_TsuH2Z-lXDEkRIA2Qv8E0FkN79oZX7g5DKdD4b3OZ7GamD8BwMA9tqeMdDzx-DJ2CyvccAR68dU3NavZnG7xsb9oquo3L_3fwwXt3wHRqGoWmF9xwl8g3Fqfx1xH-zNU9YXAV7YDjKjO9c-VnrvI7k1UZh00sEIE9UovkoVlkkRhdwpQy5AgrC17C1mOQfpLOlYK6g272SfTw",
];

export default function AboutPage() {
  const { settings } = useAccountSettings();
  const copy = ABOUT_COPY[settings.shopping.language];

  return (
    <div className="bg-background text-on-surface">
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(111,247,232,0.15)_0,transparent_50%),radial-gradient(at_100%_0%,rgba(31,126,161,0.1)_0,transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-headline font-extrabold text-6xl md:text-7xl tracking-[-0.04em] mb-8 leading-[1.1]">
              {copy.heroPrefix} <span className="text-gradient">{copy.heroBrand}</span>
            </h1>
            <p className="font-body text-xl text-on-surface-variant leading-relaxed max-w-2xl">
              {copy.heroText}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="font-label text-primary-container tracking-[0.2em] text-xs font-bold uppercase">
                {copy.missionEyebrow}
              </span>
              <h2 className="font-headline text-4xl font-bold tracking-tight">
                {copy.missionTitle}
              </h2>
            </div>
            <div className="font-body text-on-surface-variant space-y-6 text-lg leading-relaxed">
              {copy.missionParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full h-[500px] rounded-xl overflow-hidden relative group">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKFMCYqyn7YZakucL59jcTenIlafBSFeFOLRZd0cXBzqWBFQ0EenV1wtRFlwN9vZtuK6c4yr7ep5Py1-x0ejD117BMyKbHXd7F11b_8Wrx4H67GaCjN_p9PvL78vr8iDQqsNYVnTIVSYp3THcek6esUWBlf2z1Dafy_Ev2aaDj6pW0NPDvEa7b98eJnwN3dr8NtjooiSTuJhSXWawGgAddqU_HXLLCkt8dvIAqmLPu2j7V-OxCuXjey_k2K8HGBmJgHPpYOKH79Rw"
              alt="Premium toy display"
              fill
              className="object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {copy.stats.map(([value, label]) => (
            <div
              key={label}
              className="glass-card p-10 rounded-2xl text-center hover:bg-white/5 transition-all group"
            >
              <div className="font-headline text-5xl font-bold text-primary-container mb-2">
                {value}
              </div>
              <div className="font-label text-on-surface-variant tracking-widest text-xs uppercase font-semibold">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="font-headline text-5xl font-bold tracking-tighter mb-6">
              {copy.valuesTitle}
            </h2>
            <p className="text-on-surface-variant font-body leading-relaxed">
              {copy.valuesText}
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {copy.values.map((value) => (
              <div
                key={value.title}
                className="glass-card p-8 rounded-2xl space-y-6 hover:shadow-[0_0_20px_rgba(111,247,232,0.1)] transition-all"
              >
                <span className="material-symbols-outlined text-primary-container scale-150 origin-left">
                  {value.icon}
                </span>
                <div>
                  <h3 className="font-headline text-xl font-bold mb-3">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {value.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-low/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-4">
              {copy.teamTitle}
            </h2>
            <div className="h-1 w-24 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {copy.team.map((member, index) => (
              <div
                key={member.name}
                className="glass-card p-8 rounded-2xl text-center group"
              >
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                  <Image
                    src={TEAM_IMAGES[index]}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full relative z-10 border-2 border-[#6FF7E8]/20"
                  />
                </div>
                <h3 className="font-headline text-xl font-bold mb-1">
                  {member.name}
                </h3>
                <p className="font-label text-primary-container text-xs font-semibold tracking-widest uppercase mb-4">
                  {member.role}
                </p>
                <p className="font-body text-sm text-on-surface-variant">
                  {member.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 overflow-hidden relative max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-10 md:p-16 relative overflow-hidden text-center border-white/10 border">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6KotNnuU6nrPeLfDuEOeSBYh5DSu71UJt6jjjTQZF3Zd4wTbakXl4D2kDBHy3VbynCKZilo9tWdush8lIGCdYK6l8q3yxy3WFA0SQ8eSocMXS5l2ch__4ExpiEKqw4C4u1zomd7fQl5gqChuRvbKwXRuuAdu3LJvFAFHSxzsSWUDgGWjTkmRoBuoO1r3r7ilYkqG2NyjOczjhgypDtxpqQQj6IMmj3dgu7VUI_bMDnxR9LX3FOkmPXvSAYMtelErETCXdQl1I9U0"
              alt="Action figure blur"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-10">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {copy.ctaTitle}
            </h2>
            <p className="font-body text-on-surface-variant text-lg">
              {copy.ctaText}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/shop"
                className="bg-gradient-primary text-on-primary px-10 py-4 rounded-xl font-headline font-bold text-lg shadow-[0_0_20px_rgba(111,247,232,0.3)] transition-all hover:scale-105 active:scale-95 inline-block"
              >
                {copy.shopNow}
              </Link>
              <button className="px-10 py-4 rounded-xl font-headline font-bold text-lg bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all">
                {copy.viewJournal}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
