const service = require("../services/public.component.service");

exports.list = async (req, res) => {
  const result = await service.getComponents(req.query);
  res.json(result);
};

exports.details = async (req, res) => {
  const component = await service.getComponentBySlug(
    req.params.slug
  );
  res.json(component);
};
