export type ProjectItem = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  specs: string[];
};

export const projects: ProjectItem[] = [
  {
    slug: "corporate-office-network",
    title: "Corporate Office Network",
    category: "Network Infrastructure",
    location: "Lhokseumawe",
    year: "2026",
    summary:
      "Implementasi jaringan kantor modern untuk mendukung operasional user, guest WiFi, CCTV, dan akses server internal.",
    challenge:
      "Koneksi antar ruangan tidak stabil, manajemen user belum terpisah, dan belum ada monitoring perangkat jaringan.",
    solution:
      "Mendesain ulang topologi jaringan dengan core router, switch distribusi, VLAN, access point, firewall, dan monitoring.",
    results: [
      "Jaringan lebih stabil",
      "User internal dan guest terpisah",
      "Monitoring perangkat lebih mudah",
    ],
    specs: ["80+ User", "8 Access Point", "4 VLAN", "1 Core Router"],
  },
  {
    slug: "school-wifi-infrastructure",
    title: "School WiFi Infrastructure",
    category: "Education Network",
    location: "Aceh Utara",
    year: "2026",
    summary:
      "Penerapan jaringan WiFi sekolah untuk ruang kelas, kantor guru, lab komputer, dan area administrasi.",
    challenge:
      "Cakupan WiFi tidak merata dan penggunaan bandwidth sulit dikontrol.",
    solution:
      "Membangun sistem hotspot, user profile, bandwidth management, dan access point coverage yang lebih merata.",
    results: [
      "Coverage WiFi lebih luas",
      "Bandwidth lebih terkontrol",
      "Akses user lebih teratur",
    ],
    specs: ["500+ User", "12 Access Point", "Hotspot System", "Bandwidth Queue"],
  },
  {
    slug: "fiber-optic-backbone",
    title: "Fiber Optic Backbone",
    category: "Fiber Optic",
    location: "Bireuen",
    year: "2026",
    summary:
      "Pemasangan backbone fiber optik untuk menghubungkan beberapa gedung dalam satu area operasional.",
    challenge:
      "Koneksi antar gedung menggunakan kabel tembaga tidak stabil dan jarak terlalu jauh.",
    solution:
      "Menggunakan fiber optik sebagai backbone utama, terminasi ODF, SFP module, dan pengujian koneksi.",
    results: [
      "Koneksi antar gedung lebih stabil",
      "Latency lebih rendah",
      "Siap untuk pengembangan jaringan",
    ],
    specs: ["3 Gedung", "Fiber Backbone", "ODF", "SFP Module"],
  },
  {
    slug: "cctv-monitoring-system",
    title: "CCTV Monitoring System",
    category: "Security & CCTV",
    location: "Lhokseumawe",
    year: "2026",
    summary:
      "Instalasi CCTV berbasis IP camera untuk pemantauan area kantor, gudang, dan pintu masuk.",
    challenge:
      "Sistem keamanan belum terpusat dan tidak bisa dipantau secara remote.",
    solution:
      "Menggunakan IP camera, NVR, PoE switch, segmentasi jaringan CCTV, dan remote monitoring.",
    results: [
      "Monitoring area lebih mudah",
      "Akses remote tersedia",
      "Rekaman tersimpan terpusat",
    ],
    specs: ["16 IP Camera", "1 NVR", "PoE Switch", "Remote View"],
  },
  {
    slug: "mikrotik-hotspot-system",
    title: "MikroTik Hotspot System",
    category: "MikroTik & Routing",
    location: "Aceh",
    year: "2026",
    summary:
      "Konfigurasi MikroTik untuk hotspot user, voucher, bandwidth management, firewall, dan monitoring koneksi.",
    challenge:
      "Penggunaan internet tidak terkontrol dan belum ada sistem login user.",
    solution:
      "Membuat hotspot login, user profile, queue bandwidth, firewall rules, dan basic monitoring.",
    results: [
      "User lebih mudah dikelola",
      "Bandwidth lebih adil",
      "Keamanan jaringan meningkat",
    ],
    specs: ["Hotspot", "Voucher", "Firewall", "Queue Management"],
  },
  {
    slug: "private-cloud-deployment",
    title: "Private Cloud Deployment",
    category: "Server & Virtualization",
    location: "Lhokseumawe",
    year: "2026",
    summary:
      "Implementasi server virtualisasi untuk kebutuhan file server, backup, VM, dan layanan internal organisasi.",
    challenge:
      "Server masih berjalan terpisah dan backup belum terpusat.",
    solution:
      "Membangun server virtualisasi berbasis Proxmox, storage internal, backup schedule, dan VM management.",
    results: [
      "Server lebih mudah dikelola",
      "Backup lebih teratur",
      "Resource lebih efisien",
    ],
    specs: ["Proxmox", "Virtual Machine", "Backup", "NAS"],
  },
];