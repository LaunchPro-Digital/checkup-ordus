import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft, ArrowRight, Plus, X, Globe, Instagram, Linkedin,
  MessageCircle, Youtube, Music2, MapPin, Link2, ArrowRightCircle,
} from "lucide-react";
import type { Channel, ChannelType } from "@/types/checkup";
import { CHANNEL_OPTIONS } from "@/types/checkup";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CHANNEL_ICONS: Record<ChannelType, React.ElementType> = {
  website:         Globe,
  instagram:       Instagram,
  linkedin:        Linkedin,
  whatsapp:        MessageCircle,
  youtube:         Youtube,
  tiktok:          Music2,
  google_business: MapPin,
  other:           Link2,
};

interface ChannelSelectorProps {
  initialChannels?: Channel[];
  onSubmit: (channels: Channel[]) => void;
  onBack: () => void;
}

function normalizeUrl(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function ChannelSelector({ initialChannels = [], onSubmit, onBack }: ChannelSelectorProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<ChannelType>>(
    new Set(initialChannels.map((c) => c.type))
  );
  const [channelUrls, setChannelUrls] = useState<Record<ChannelType, string>>(
    initialChannels.reduce((acc, c) => ({ ...acc, [c.type]: c.url }), {} as Record<ChannelType, string>)
  );
  const [otherChannels, setOtherChannels] = useState<{ label: string; url: string }[]>(
    initialChannels
      .filter((c) => c.type === "other")
      .map((c) => ({ label: c.label || "", url: c.url }))
  );

  const toggleChannel = (type: ChannelType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const updateChannelUrl = (type: ChannelType, url: string) =>
    setChannelUrls((prev) => ({ ...prev, [type]: url }));

  const addOtherChannel = () =>
    setOtherChannels((prev) => [...prev, { label: "", url: "" }]);

  const removeOtherChannel = (index: number) =>
    setOtherChannels((prev) => prev.filter((_, i) => i !== index));

  const updateOtherChannel = (index: number, field: "label" | "url", value: string) =>
    setOtherChannels((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));

  const handleSubmit = () => {
    const channelsWithoutUrl = CHANNEL_OPTIONS.filter(
      (opt) => selectedTypes.has(opt.type) && !channelUrls[opt.type]?.trim()
    );
    if (channelsWithoutUrl.length > 0) {
      const names = channelsWithoutUrl.map((c) => c.label).join(", ");
      toast.warning("Canais sem link", {
        description: `${names} ${channelsWithoutUrl.length === 1 ? "foi marcado" : "foram marcados"} sem URL e não ${channelsWithoutUrl.length === 1 ? "será incluído" : "serão incluídos"} no diagnóstico.`,
      });
    }

    const channels: Channel[] = [];

    CHANNEL_OPTIONS.forEach((option) => {
      if (selectedTypes.has(option.type) && channelUrls[option.type]?.trim()) {
        channels.push({
          type: option.type,
          url: normalizeUrl(channelUrls[option.type]),
        });
      }
    });

    otherChannels.forEach((c) => {
      if (c.label && c.url) {
        channels.push({ type: "other", label: c.label, url: normalizeUrl(c.url) });
      }
    });

    onSubmit(channels);
  };

  return (
    <div className="w-full max-w-2xl mx-auto motion-safe:animate-fade-in space-y-6">
      <div className="text-center">
        <h2
          className="font-sans font-black uppercase leading-none mb-3"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', letterSpacing: '-0.02em', color: '#F0F0F3' }}
        >
          Canais de Presença
        </h2>
        <p className="text-sm md:text-base" style={{ color: '#ABABAB' }}>
          Selecione onde sua empresa tem presença online e adicione os links.{' '}
          Esses canais serão analisados pela IA para gerar sua devolutiva personalizada.
        </p>
      </div>

      <div className="card-elevated p-6 md:p-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {CHANNEL_OPTIONS.map((option) => {
            const Icon = CHANNEL_ICONS[option.type];
            const isSelected = selectedTypes.has(option.type);

            return (
              <div
                key={option.type}
                className={cn(
                  "rounded-xl border p-4 transition-all cursor-pointer",
                  isSelected
                    ? "border-cta/50 bg-cta/5"
                    : "border-border hover:border-white/15"
                )}
                onClick={() => toggleChannel(option.type)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox
                    id={option.type}
                    checked={isSelected}
                    onCheckedChange={() => toggleChannel(option.type)}
                    onClick={e => e.stopPropagation()}
                    className={isSelected ? "border-cta data-[state=checked]:bg-cta data-[state=checked]:border-cta" : ""}
                  />
                  <Label htmlFor={option.type} className="flex items-center gap-2 cursor-pointer font-label text-[11px] tracking-wide" style={{ color: isSelected ? '#00D4A0' : '#ABABAB' }}>
                    <Icon className="w-3.5 h-3.5" />
                    {option.label}
                  </Label>
                </div>
                {isSelected && (
                  <Input
                    placeholder={option.placeholder}
                    value={channelUrls[option.type] || ""}
                    onChange={(e) => updateChannelUrl(option.type, e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-label text-[11px] tracking-wide" style={{ color: '#6A6A6A' }}>Outros Canais</Label>
            <Button type="button" variant="outline" size="sm" onClick={addOtherChannel}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {otherChannels.map((channel, index) => (
            <div key={index} className="flex gap-3 items-start motion-safe:animate-fade-in">
              <div className="flex-1 grid gap-3 sm:grid-cols-2">
                <Input placeholder="Nome do canal (ex: Threads)" value={channel.label} onChange={(e) => updateOtherChannel(index, "label", e.target.value)} />
                <Input placeholder="https://…" value={channel.url} onChange={(e) => updateOtherChannel(index, "url", e.target.value)} />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeOtherChannel(index)} className="text-muted-foreground hover:text-destructive" aria-label="Remover canal">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => onSubmit([])} className="text-muted-foreground">
              <ArrowRightCircle className="w-4 h-4 mr-2" />
              Pular
            </Button>

            <Button variant="cta" onClick={handleSubmit}>
              CONTINUAR → CHECKUP
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
