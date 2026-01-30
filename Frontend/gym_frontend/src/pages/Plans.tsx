import React from 'react';
import { Check, X, Shield, Zap, Target, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

const Plans: React.FC = () => {
    const { user } = useAuth();

    const handleEnroll = async (planName: string) => {
        if (!user) {
            toast.error('Strategic Auth Required', {
                description: 'Please login to initialize plan enrollment protocols.'
            });
            return;
        }

        try {
            const response = await api.post('/enroll-plan', { planName });

            if (response.status === 200) {
                toast.success('Enrollment Request Initialized', {
                    description: `Strategic request for ${planName} has been transmitted to Nexus Command.`
                });
            }
        } catch (error: any) {
            console.error('Enrollment error:', error);
        }
    };

    const featureList = [
        "Customised Diet Plan",
        "Customised Training Plan",
        "Customised Supplementation Plan",
        "Customised Cardio Plan",
        "24/7 Whatsapp Support",
        "Weekly Check-ins",
        "One-on-one Meeting"
    ];

    const plans = [
        {
            name: "Spartan Starter",
            color: "bg-red-600",
            features: [true, false, true, false, true, true, false],
            icon: <Target className="w-8 h-8 text-red-600" />
        },
        {
            name: "Spartan Gainer",
            color: "bg-black",
            features: [true, false, true, true, true, true, false],
            icon: <Zap className="w-8 h-8 text-gray-800" />
        },
        {
            name: "Spartan Shred",
            color: "bg-gray-900",
            features: [true, true, true, true, true, true, true],
            icon: <Shield className="w-8 h-8 text-black" />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-brand">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black text-brand tracking-tighter uppercase mb-4">
                        Our Plans
                    </h1>
                    <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-brand-matte/60 uppercase tracking-[0.3em] font-bold text-sm">
                        Select Your Strategic Evolution Protocol
                    </p>
                </div>

                <div className="bg-white border border-brand/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 border-b border-brand/10">
                        <div className="p-8 flex items-center justify-center border-r border-brand/10 bg-gray-50/50">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand/40">
                                Strategic Matrix
                            </span>
                        </div>
                        {plans.map((plan) => (
                            <div key={plan.name} className={`${plan.color} p-8 text-center border-r border-brand/10 last:border-r-0`}>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
                                    {plan.name.split(' ')[0]} <br /> {plan.name.split(' ')[1]}
                                </h2>
                            </div>
                        ))}
                    </div>

                    {featureList.map((feature, idx) => (
                        <div key={feature} className="grid grid-cols-1 md:grid-cols-4 border-b border-brand/10 hover:bg-gray-50 transition-colors group">
                            <div className="p-6 md:p-8 border-r border-brand/10 bg-gray-50/30">
                                <span className="text-xs font-bold uppercase tracking-widest text-brand-matte/80 group-hover:text-brand transition-colors">
                                    {feature}
                                </span>
                            </div>
                            {plans.map((plan) => (
                                <div key={`${plan.name}-${feature}`} className="p-6 md:p-8 flex items-center justify-center border-r border-brand/10 last:border-r-0">
                                    {plan.features[idx] ? (
                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                            <Check className="w-5 h-5 text-green-600 stroke-[3px]" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                                            <X className="w-5 h-5 text-red-600 stroke-[3px]" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-4 bg-gray-50/50">
                        <div className="p-8 border-r border-brand/10 md:block hidden"></div>
                        {plans.map((plan) => (
                            <div key={plan.name} className="p-8 border-r border-brand/10 last:border-r-0 text-center">
                                <button
                                    onClick={() => handleEnroll(plan.name)}
                                    className={`w-full py-4 px-6 rounded-none font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-3
                    ${plan.name === 'Spartan Starter' ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' :
                                            plan.name === 'Spartan Gainer' ? 'bg-black text-white hover:bg-gray-800 shadow-gray-200' :
                                                'bg-gray-900 text-white hover:bg-black shadow-gray-200'}`}
                                >
                                    <Mail className="w-4 h-4" />
                                    Enroll Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div key={plan.name} className="bg-white p-8 border border-brand/5 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                            <div className="mb-6">{plan.icon}</div>
                            <h3 className="text-xl font-black text-brand uppercase tracking-tighter mb-4 group-hover:text-red-600 transition-colors">
                                {plan.name} Philosphy
                            </h3>
                            <p className="text-brand-matte/60 text-sm leading-relaxed mb-6 font-medium">
                                Our {plan.name} program is architected specifically for those seeking {plan.name === 'Spartan Shred' ? 'maximum definition' : plan.name === 'Spartan Gainer' ? 'serious muscle mass' : 'a solid foundation'}. Every variable is accounted for.
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand">
                                <div className="h-px w-8 bg-brand/20"></div>
                                Join The Elite
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Plans;
