$content = Get-Content src/components/LoreReactions.astro -Raw
$content = $content -replace '"'"'\$\{reaction\.emoji\}"'"', '"'"'\${reaction.emoji}"'"'
$content = $content -replace '"'"'btn\.setAttribute\("aria-label", \$\{emoji\} : \)"'"', '"'"'btn.setAttribute("aria-label", `${emoji} ${label}: ${counts[kind]}`)"'"'
$content = $content -replace '"'"'const labelKey = label as keyof LoreReactionCatalogEntry;"'"', '"'"'const labelKey = `label${lang.toUpperCase()}` as keyof LoreReactionCatalogEntry;"'"'
$content = $content -replace '"'"'const label = reaction\[labelKey\];"'"', '"'"'const label = reaction[labelKey];"'"'
$content = $content -replace '"'"'class=\{lore-reactions__button \}"'"', '"'"'class={`lore-reactions__button ${isActuallyDisabled ? "lore-reactions__button--disabled" : ""}`}"'"'
$content = $content -replace '"'"'const labelKey = label;"'"', '"'"'const labelKey = `label${langStr.toUpperCase()}`;"'"'
Set-Content src/components/LoreReactions.astro -Value $content
