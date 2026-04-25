import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-background text-on-surface">
      {/* Hero Banner */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(111,247,232,0.15)_0,transparent_50%),radial-gradient(at_100%_0%,rgba(31,126,161,0.1)_0,transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-headline font-extrabold text-6xl md:text-7xl tracking-[-0.04em] mb-8 leading-[1.1]">
              About <span className="text-gradient">Overlord Toys</span>
            </h1>
            <p className="font-body text-xl text-on-surface-variant leading-relaxed max-w-2xl">
              Your trusted destination for premium toys and collectibles since 2020. We curate the extraordinary for those who refuse to settle for the common.
            </p>
          </div>
        </div>
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6FF7E8]/10 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="font-label text-primary-container tracking-[0.2em] text-xs font-bold uppercase">Our Mission</span>
              <h2 className="font-headline text-4xl font-bold tracking-tight">Built on Passion & Authenticity</h2>
            </div>
            <div className="font-body text-on-surface-variant space-y-6 text-lg leading-relaxed">
              <p>
                What started as a private collection in 2020 evolved into a global sanctuary for enthusiasts. Overlord Toys was born from the frustration of finding genuine, high-tier collectibles in a sea of replicas. 
              </p>
              <p>
                We believe every artifact tells a story. Our team of expert curators travels across continents to secure exclusive partnerships with the world's most innovative toy manufacturers, ensuring every item in our vault is 100% authentic.
              </p>
              <p>
                At the heart of Overlord is a community. We don't just sell toys; we foster a digital reliquary where collectors can connect, showcase, and celebrate the artistry behind high-end manufacturing.
              </p>
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

      {/* Stats Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-10 rounded-2xl text-center hover:bg-white/5 transition-all group">
            <div className="font-headline text-5xl font-bold text-primary-container mb-2">50,000+</div>
            <div className="font-label text-on-surface-variant tracking-widest text-xs uppercase font-semibold">Happy Customers</div>
          </div>
          <div className="glass-card p-10 rounded-2xl text-center hover:bg-white/5 transition-all group">
            <div className="font-headline text-5xl font-bold text-primary-container mb-2">10,000+</div>
            <div className="font-label text-on-surface-variant tracking-widest text-xs uppercase font-semibold">Products</div>
          </div>
          <div className="glass-card p-10 rounded-2xl text-center hover:bg-white/5 transition-all group">
            <div className="font-headline text-5xl font-bold text-primary-container mb-2">99.5%</div>
            <div className="font-label text-on-surface-variant tracking-widest text-xs uppercase font-semibold">Satisfaction Rate</div>
          </div>
          <div className="glass-card p-10 rounded-2xl text-center hover:bg-white/5 transition-all group">
            <div className="font-headline text-5xl font-bold text-primary-container mb-2">24/7</div>
            <div className="font-label text-on-surface-variant tracking-widest text-xs uppercase font-semibold">Customer Support</div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="font-headline text-5xl font-bold tracking-tighter mb-6">The Core Protocols</h2>
            <p className="text-on-surface-variant font-body leading-relaxed">The principles that guide every acquisition and interaction in our ecosystem.</p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-8 rounded-2xl space-y-6 hover:shadow-[0_0_20px_rgba(111,247,232,0.1)] transition-all">
              <span className="material-symbols-outlined text-primary-container scale-150 origin-left">verified</span>
              <div>
                <h3 className="font-headline text-xl font-bold mb-3">Quality First</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">Every piece undergoes a multi-point inspection. We only sell authentic, premium products from verified sources.</p>
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl space-y-6 hover:shadow-[0_0_20px_rgba(111,247,232,0.1)] transition-all">
              <span className="material-symbols-outlined text-primary-container scale-150 origin-left">group</span>
              <div>
                <h3 className="font-headline text-xl font-bold mb-3">Community</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">Built by collectors for collectors. We host exclusive events and build spaces for our vault members.</p>
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl space-y-6 hover:shadow-[0_0_20px_rgba(111,247,232,0.1)] transition-all">
              <span className="material-symbols-outlined text-primary-container scale-150 origin-left">biotech</span>
              <div>
                <h3 className="font-headline text-xl font-bold mb-3">Innovation</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">Access the latest tech-integrated toys and limited figures from globally renowned designers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-surface-container-low/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-4">Meet Our Team</h2>
            <div className="h-1 w-24 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl text-center group">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv9eHtqzOE5yyw5zKt06N8bswrLqOaLPhuQHuUtoQRKck0bz96zsXhKttoIIpePlU7GhlFdz8wXaik-YS7e8jNWH9Enx8niwQjcqSmIdtNJ776xlifgPkH7vPG_Xr9t8BcR1ToMQm-rFtmRi4Il8NHoC617EtYlfDTr5nM5l61MYNutcdwxsV_WXwdGnLsN0Yfb5FDQiVHrz4dTUtsPms5F29HUMLiz4r9Ou0mD6hQMnWRoy1YlKWXWlVH9LyAADj5djHIy9FV4L0" alt="Marcus Vane" width={128} height={128} className="w-full h-full object-cover rounded-full relative z-10 border-2 border-[#6FF7E8]/20" />
              </div>
              <h3 className="font-headline text-xl font-bold mb-1">Marcus Vane</h3>
              <p className="font-label text-primary-container text-xs font-semibold tracking-widest uppercase mb-4">Chief Curator & Founder</p>
              <p className="font-body text-sm text-on-surface-variant">Oversees all artifact acquisitions and global manufacturer partnerships.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl text-center group">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlrJktrfRXiZpVtzws5l7PZIwl5nHdHij7_4vOpF0tBzgTM8QtfaoWknaHdsYtDOjUtbAzff-ahjnzFkQrnPqMM4C2HjMtwWsOQdyVGfUIAoEmEMlp0oVoBNEYk-MkERyX5Cj7siM0AS2b7RRhmi6DDv1ucyd4Ug3Y4jRrRh1JxaZiO8R3_t1Qij7gGae2VwYmT_k01IczH8Ds2UpAdTG_H1ZIgVufmdRFZmOLQb8ZuciB3nZHuXhzV2z3-VIeOZ2egDy99JtnMuE" alt="Elias Thorne" width={128} height={128} className="w-full h-full object-cover rounded-full relative z-10 border-2 border-[#6FF7E8]/20" />
              </div>
              <h3 className="font-headline text-xl font-bold mb-1">Elias Thorne</h3>
              <p className="font-label text-primary-container text-xs font-semibold tracking-widest uppercase mb-4">Exhibition Director</p>
              <p className="font-body text-sm text-on-surface-variant">Designs the digital and physical gallery experiences for new releases.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl text-center group">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmLuYiHRBcCII_FhzqoE2Kb9_QQp9pjtuhKoY2aX--b3gAUBCHJvKoHUTpRVdZZ_TsuH2Z-lXDEkRIA2Qv8E0FkN79oZX7g5DKdD4b3OZ7GamD8BwMA9tqeMdDzx-DJ2CyvccAR68dU3NavZnG7xsb9oquo3L_3fwwXt3wHRqGoWmF9xwl8g3Fqfx1xH-zNU9YXAV7YDjKjO9c-VnrvI7k1UZh00sEIE9UovkoVlkkRhdwpQy5AgrC17C1mOQfpLOlYK6g272SfTw" alt="Kai Satori" width={128} height={128} className="w-full h-full object-cover rounded-full relative z-10 border-2 border-[#6FF7E8]/20" />
              </div>
              <h3 className="font-headline text-xl font-bold mb-1">Kai Satori</h3>
              <p className="font-label text-primary-container text-xs font-semibold tracking-widest uppercase mb-4">Head of Community</p>
              <p className="font-body text-sm text-on-surface-variant">Manages collector relations and VIP membership protocols.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 overflow-hidden relative max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-10 md:p-16 relative overflow-hidden text-center border-white/10 border">
          {/* Background visual */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6KotNnuU6nrPeLfDuEOeSBYh5DSu71UJt6jjjTQZF3Zd4wTbakXl4D2kDBHy3VbynCKZilo9tWdush8lIGCdYK6l8q3yxy3WFA0SQ8eSocMXS5l2ch__4ExpiEKqw4C4u1zomd7fQl5gqChuRvbKwXRuuAdu3LJvFAFHSxzsSWUDgGWjTkmRoBuoO1r3r7ilYkqG2NyjOczjhgypDtxpqQQj6IMmj3dgu7VUI_bMDnxR9LX3FOkmPXvSAYMtelErETCXdQl1I9U0" alt="Action figure blur" fill className="object-cover" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-10">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">Ready to Start Your Collection?</h2>
            <p className="font-body text-on-surface-variant text-lg">Join the thousands of serious collectors who trust Overlord Toys for their next artifact.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/shop" className="bg-gradient-primary text-on-primary px-10 py-4 rounded-xl font-headline font-bold text-lg shadow-[0_0_20px_rgba(111,247,232,0.3)] transition-all hover:scale-105 active:scale-95 inline-block">
                Shop Now
              </Link>
              <button className="px-10 py-4 rounded-xl font-headline font-bold text-lg bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all">
                View Journal
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
