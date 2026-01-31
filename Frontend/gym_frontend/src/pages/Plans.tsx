import React, { useState } from 'react';
import { Calendar, Loader2, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Plans: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleEnroll = (planName: string) => {
        if (!localStorage.getItem('token')) {
            toast.error("Please login to enroll");
            navigate('/login');
            return;
        }

        setLoading(true);
        // Simulate enrollment
        setTimeout(() => {
            setLoading(false);
            toast.success(`Welcome to the ${planName}!`, {
                description: "Our team will contact you shortly to finalize your schedule."
            });
        }, 1500);
    };

    const plans = [
        {
            name: "Standard Protocol",
            price: "5,000",
            duration: "Monthly",
            description: "Essential foundation for fitness enthusiasts looking for structure and results.",
            features: [
                "Customized Workout Plans",
                "Basic Nutritional Guide",
                "Locker Room Access",
                "Standard Equipment Access",
                "Community Support"
            ],
            accent: "brand-matte",
            popular: false
        },
        {
            name: "Elite Performance",
            price: "12,000",
            duration: "Monthly",
            description: "Advanced coaching and physiological monitoring for serious athletes and competitors.",
            features: [
                "All Standard Features",
                "Bi-Weekly 1-on-1 Coaching",
                "Precision Diet Plans",
                "Recovery Protocol Design",
                "Advanced Lab Analytics"
            ],
            accent: "brand",
            popular: true
        },
        {
            name: "Platinum Access",
            price: "30,000",
            duration: "Quarterly",
            description: "Full-spectrum transformation program including supplementation and direct monitoring.",
            features: [
                "All Elite Features",
                "Daily Progress Tracking",
                "Full Supplement Provision",
                "Priority Support 24/7",
                "Bio-Individual Adjustments"
            ],
            accent: "brand-gold",
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-brand-warm pt-32 pb-40">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <span className="w-12 h-px bg-brand"></span>
                        <span className="text-[10px] font-black text-brand uppercase tracking-[0.5em]">Subscription Tiers</span>
                        <span className="w-12 h-px bg-brand"></span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-brand-matte uppercase tracking-tighter leading-none">
                        SELECT YOUR <br />
                        <span className="text-brand italic text-shadow-sm">TRANSFORMATION</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-brand-matte/50 text-sm font-medium leading-relaxed uppercase tracking-widest italic pt-4">
                        Choose a plan that aligns with your objectives. Each protocol is engineered for specific biological outcomes and performance scaling.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`group relative flex flex-col bg-white border border-brand-matte/5 shadow-sm p-12 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${plan.popular ? 'ring-4 ring-brand/10' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-brand text-white text-[9px] font-black px-8 py-2 uppercase tracking-widest rotate-45 translate-x-[25px] translate-y-[15px] shadow-lg">
                                        Popular
                                    </div>
                                </div>
                            )}

                            <div className="mb-12">
                                <h3 className={`text-2xl font-black uppercase tracking-tighter mb-4 ${plan.accent === 'brand' ? 'text-brand' : 'text-brand-matte'}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-5xl font-black text-brand-matte italic tracking-tighter">Rs.{plan.price}</span>
                                    <span className="text-brand-matte/30 text-[10px] font-black uppercase tracking-widest mb-1">/ {plan.duration}</span>
                                </div>
                                <p className="text-brand-matte/50 text-xs font-medium leading-relaxed italic">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-6 mb-12 flex-grow">
                                <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Calendar className="w-4 h-4" /> Core Deliverables
                                </p>
                                <ul className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-4 group/item">
                                            <div className="w-5 h-5 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-brand-gold group-hover/item:scale-125 transition-transform" />
                                            </div>
                                            <span className="text-[11px] font-black text-brand-matte/70 uppercase tracking-widest transition-colors group-hover/item:text-brand-matte">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => handleEnroll(plan.name)}
                                disabled={loading}
                                className={`w-full py-6 text-[12px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${plan.popular
                                        ? 'bg-brand text-white hover:bg-brand-matte shadow-brand/20'
                                        : 'bg-brand-matte text-white hover:bg-brand shadow-brand-matte/20'
                                    } disabled:opacity-50`}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>Enroll Now <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <p className="text-brand-matte/30 text-[10px] font-black uppercase tracking-[0.3em]">
                        All plans include access to our base facilities and community events. <br />
                        Corporate and group rates available upon request.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Plans;
