import React from "react";

const tiers = [
  {
    name: "Silver",
    description: "Earn 1 point per wash. Redeem for free upgrades.",
    perks: ["Free air freshener", "Priority booking"],
    icon: "🥈"
  },
  {
    name: "Gold",
    description: "Earn 2 points per wash. Redeem for premium services.",
    perks: ["Free wax upgrade", "Birthday bonus", "Exclusive offers"],
    icon: "🥇"
  },
  {
    name: "Platinum",
    description: "Earn 3 points per wash. Redeem for luxury packages.",
    perks: ["Free ceramic coating", "VIP lounge access", "Personalized care"],
    icon: "🏆"
  }
];

const LoyaltyRewards = () => (
  <section className="py-20 bg-black relative overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">Loyalty Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <div key={tier.name} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 flex flex-col items-center hover:border-primary/50 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-6xl mb-4">{tier.icon}</div>
            <h3 className="text-2xl font-bold text-primary mb-2">{tier.name}</h3>
            <p className="text-white/70 mb-4 text-center">{tier.description}</p>
            <ul className="mb-4 space-y-2">
              {tier.perks.map((perk, i) => (
                <li key={i} className="flex items-center text-white/80"><span className="mr-2 text-primary">✔️</span>{perk}</li>
              ))}
            </ul>
            <button className="mt-auto py-2 px-6 bg-gradient-to-r from-primary to-cyan-400 hover:from-primary hover:to-primary text-black font-bold rounded-full shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300">Join Now</button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LoyaltyRewards;