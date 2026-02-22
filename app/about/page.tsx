"use client";

import { useLanguage } from "@/contexts/language-context";
import { Target, Eye, Heart, Leaf, Users, Shield, TrendingUp, Globe, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const content = {
    en: {
      title: "About Us",
      intro: {
        title: "About Us",
        text: `The Centre for Participation and Collaboration "CPC" was established on September 28, 2020. Since its founding, the organization has been involved in monitoring public governance reforms. The CPC actively participates in environmental policy, sustainable development, good governance, citizen engagement, and identifying women's needs.`
      },
      vision: {
        title: "Our Vision",
        text: `The Centre for Participation and Collaboration - CPC is an accountable, trusted, and highly reputable organization, staffed by a team of professionals, successfully fulfilling the role of mediator between local government and citizens. At the same time, it is a leading organization in environmental protection, sustainable development, good governance, participatory democracy, ensuring citizen engagement and advocating for vulnerable groups; it is also an authoritative, objective and conscientious partner for the media, civil society and international organizations, upholding European values and modern standards.`
      },
      mission: {
        title: "Our Mission",
        text: `Our mission is to help people living in communities to overcome poverty with dignity. To this end, we use diverse professional experience and resources. We implement innovative approaches and strengthen the institutional responsibility and sustainability of partner organizations.`
      },
      directions: {
        title: "Key Directions",
        items: [
          "Environmental activities and advocacy",
          "Supporting local self-government reform",
          "Promoting citizen participation and engagement",
          "Promoting the protection of human rights and freedoms",
          "Protecting women's rights and their economic empowerment",
          "Supporting vulnerable groups' initiatives",
          "Tourism potential development",
          "Information campaigns and monitoring"
        ]
      }
    },
    ka: {
      title: "ჩვენ შესახებ",
      intro: {
        title: "ჩვენ შესახებ",
        text: `ა(ა)იპ „თანამონაწილეობისა და ჩართულობის ცენტრი „სიპისი" (Centre for Participation and Collaboration CPC) შეიქმნა 2020 წლის 28 სექტემბერს. დაარსებიდან დღემდე ორგანიზაცია მონაწილეობს საჯარო მმართველობის რეფორმის მონიტორინგში; „თანამონაწილეობისა და ჩართულობის ცენტრი „სიპისი" აქტიურადაა ჩართული გარემოსდაცვითი პოლიტიკის, მდგარდი განვითარების, კარგი მმართველობის, მოქალაქეთა ჩართულობის, ქალთა საჭიროებების ინდენტიფიცირების გაძლიერების მიმართულებით.`
      },
      vision: {
        title: "ორგანიზაციის ხედვა",
        text: `თანამონაწილეობისა და ჩართულობის ცენტრი - სიპისი არის ანგარიშგასაწევი, სანდო და მაღალი რეპუტაციის მქონე ორგანიზაცია, დაკომპლექტებული პროფესიონალთა გუნდით, წარმატებით ასრულებს მედიატორის როლს ადგილობრივ მმართველობასა და მოქალაქეებს შორის. ამავდროულად, არის ლიდერი ორგანიზაცია გარემოსდაცვითი, მდგრადი განვითარების, კარგი მმართველობის, მონაწილეობითი დემოკრატიის, მოქალაქეთა ჩართულობის უზრუნველყოფისა და მოწყვლადი ჯგუფების ადვოკატირების მიმართულებით; ასევე მედიის, სამოქალაქო სექტორისა და საერთაშორისო ორგანიზაციებისთვის არის ავტორიტეტული, ობიექტური და კეთილსინდისიერი პარტნიორი, რომელიც იცავს ევროპულ ღირებულებებს და თანამედროვე სტანდარტებს.`
      },
      mission: {
        title: "ჩვენი მისია",
        text: `ჩვენი მისიაა, თემებში მცხოვრები მოსახლეობის დახმარება, რათა მათ ღირსეულად შეძლონ სიღარიბის დაძლევა. ამ მიზნით ჩვენ ვიყენებთ მრავალფეროვან პროფესიულ გამოცდილებასა და რესურსებს. ვნერგავთ ინოვაციურ მიდგომებს და ვაძლიერებთ პარტნიორი ორგანიზაციების ინსტიტუციურ პასუხისმგებლობას და მდგრადობას.`
      },
      directions: {
        title: "ძირითადი მიმართულებები",
        items: [
          "გარემოსდაცვითი აქტივობები და ადვოკატირება",
          "ადგილობრივი თვითმმართველობის რეფორმირების მხარდაჭერა",
          "მოქალაქეთა თანამონაწილეობისა და ჩართულობის ხელშეწყობა",
          "ადამიანის უფლებების და თავისუფლების დაცვის ხელშეწყობა",
          "ქალთა უფლებების დაცვა და მათი ეკონომიკური გაძლიერება",
          "მოწყვლადი ჯგუფების ინიციატივების მხარდაჭერა",
          "ტურისტული პოტენციალის განვითარება",
          "საინფორმაციო კამპანიები და მონიტორინგი"
        ]
      }
    }
  };

  const t = content[language];

  const directionIcons = [
    Leaf,
    Shield,
    Users,
    Heart,
    TrendingUp,
    Users,
    Globe,
    Target
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-8 w-8" />
            {language === "en" ? "Back" : "უკან"}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">{t.intro.title}</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.intro.text}
            </p>
          </div>
        </section>

        {/* Vision */}
        <section className="mb-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">{t.vision.title}</h2>
            </div>
            <div className="bg-muted/30 p-8 rounded-lg border border-border">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.vision.text}
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">{t.mission.title}</h2>
            </div>
            <div className="bg-primary/5 p-8 rounded-lg border border-primary/20">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.mission.text}
              </p>
            </div>
          </div>
        </section>

        {/* Key Directions */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">{t.directions.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
            {t.directions.items.map((item, index) => {
              const IconComponent = directionIcons[index] || Target;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 bg-muted/20 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-base leading-relaxed pt-1.5">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
